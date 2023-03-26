// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IWETH is IERC20 {
    function deposit() external payable;
    function withdraw(uint wad) external;
}

interface ISentibleRouterV1 {
  function deposit(
    address asset,
    uint256 amount,
    address onBehalfOf
  ) external;

  function withdraw(
    address asset,
    uint256 amount,
    address to
  ) external;
}

contract GhoPay is ReentrancyGuard {
  using SafeERC20 for IERC20;

  address immutable public owner = msg.sender;
  address token;
  address SentibleRouterAddress;

  ISentibleRouterV1 public SentibleRouter;
  IERC20 public PaymentToken;

  event Deposit(address account, uint256 amount);
  event Withdraw(address account, uint256 amount);
  event QuoteFilled(
    address indexed user,
    address indexed sellToken,
    address indexed buyToken,
    uint256 sellAmount,
    uint256 buyAmount,
    uint256 timestamp
  );

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

  constructor() {
    token = 0x9FD21bE27A2B059a288229361E2fA632D8D2d074;
    SentibleRouterAddress = 0xF7c9E30f36d79ae499B62baCaf58C8501d969877;
    SentibleRouter = ISentibleRouterV1(0xF7c9E30f36d79ae499B62baCaf58C8501d969877);
    PaymentToken = IERC20(0x9FD21bE27A2B059a288229361E2fA632D8D2d074);
    PaymentToken.approve(0xF7c9E30f36d79ae499B62baCaf58C8501d969877, type(uint256).max);
  }

  function approveSpender(address asset, uint256 amount, address spender) public onlyOwner {
    IERC20(asset).approve(spender, amount);
  }

  function withdraw(uint256 _amount, address _token) external nonReentrant {
    require(_amount > 0, "amount must be greater than zero");
    SentibleRouter.withdraw(token, _amount, address(this));
    IERC20(_token).safeTransferFrom(address(this), msg.sender, _amount);

    emit Withdraw(msg.sender, _amount);
  }

  function setPaymentToken(address _token) external onlyOwner {
    require(_token != address(0), "token address is zero");
    token = _token;
    PaymentToken = IERC20(_token);
    PaymentToken.approve(SentibleRouterAddress, type(uint256).max);
  }

  function setRouterAddress(address _SentibleRouterAddress) external onlyOwner {
    SentibleRouterAddress = _SentibleRouterAddress;
    SentibleRouter = ISentibleRouterV1(_SentibleRouterAddress);
    PaymentToken.approve(_SentibleRouterAddress, type(uint256).max);
  }

  // Swaps ERC20->ERC20 tokens using a 0x-API quote.
  function _fillQuote(
    IERC20 sellToken,
    IERC20 buyToken,
    address spender,
    address payable swapTarget,
    bytes calldata swapCallData,
    uint256 sellAmount,
    bool transferFrom
  ) internal returns (uint256) {
    address contractAddress = address(this);
    require(sellToken.allowance(msg.sender, contractAddress) >= sellAmount && address(sellToken) != address(buyToken), "Allowance required or Sell token cannot be the same as buy token");

    // Store the sellToken balance before transferring it to the contract
    uint256 initialBuyTokenBalance = buyToken.balanceOf(contractAddress);

    sellToken.approve(spender, sellAmount);
    // buyToken.approve(spender, type(uint256).max);
    if (transferFrom) {
      sellToken.safeTransferFrom(msg.sender, contractAddress, sellAmount);
    }

    // Call the encoded swap function call on the contract at `swapTarget`,
    // passing along any ETH attached to this function call
    (bool success, ) = swapTarget.call{value: 0}(swapCallData);

    // return users tokens if swap fails
    if (!success) {
      sellToken.safeTransfer(msg.sender, sellAmount);
      return 0;
    }

    // Calculate the amount of `buyToken` that was received by the `msg.sender`.
    uint256 finalBuyTokenBalance = buyToken.balanceOf(contractAddress);
    uint256 buyTokenReceived = finalBuyTokenBalance - initialBuyTokenBalance;

    emit QuoteFilled(msg.sender, address(sellToken), address(buyToken), sellAmount, buyTokenReceived, block.timestamp);
    return buyTokenReceived;
  }

  // Swaps ERC20->ERC20 tokens and returns the received tokens to the caller.
  function fillQuote(
    IERC20 sellToken,
    IERC20 buyToken,
    address spender,
    address payable swapTarget,
    bytes calldata swapCallData,
    uint256 sellAmount,
    address to
  ) external payable nonReentrant {
    // Call the fillQuote internal function to perform the token swap and get the amount of buyToken received.
    uint256 buyTokenReceived = _fillQuote(sellToken, buyToken, spender, swapTarget, swapCallData, sellAmount, true);

    // Transfer the received `buyToken` to the `msg.sender`.
    buyToken.safeTransfer(to, buyTokenReceived);
  }

  // Swaps ERC20->ERC20 tokens and deposits the received tokens to SentibleRouter.
  function fillQuoteAndDeposit(
    IERC20 sellToken,
    IERC20 buyToken,
    address spender,
    address payable swapTarget,
    bytes calldata swapCallData,
    uint256 sellAmount,
    address to
  ) external payable nonReentrant {
    // Call the fillQuote internal function to perform the token swap and get the amount of buyToken received.
    uint256 buyTokenReceived = _fillQuote(sellToken, buyToken, spender, swapTarget, swapCallData, sellAmount, true);

    // Deposit the received buyToken to SentibleRouter.
    SentibleRouter.deposit(address(buyToken), buyTokenReceived, to);
  }

  function wrapETHAndPay(
    IWETH WETH,
    IERC20 buyToken,
    uint256 ethAmount,
    address spender,
    address payable swapTarget,
    bytes calldata swapCallData,
    address to
  ) external payable {
    require(msg.value == ethAmount, "ETH amount mismatch");
    // add users ETH to the contract
    address contractAddress = address(this);
    (bool success, ) = contractAddress.call{value: ethAmount}("");
    require(success, "Failed to transfer ETH");

    // Wrap the ETH sent with the transaction into WETH
    IWETH(WETH).deposit{value: msg.value}();

    // Call the fillQuote internal function to perform the token swap and get the amount of buyToken received.
    uint256 buyTokenReceived = _fillQuote(WETH, buyToken, spender, swapTarget, swapCallData, ethAmount, false);

    // Deposit the received buyToken to SentibleRouter.
    SentibleRouter.deposit(address(PaymentToken), buyTokenReceived, to);
  }

  receive() external payable {}
}

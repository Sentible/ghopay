import dynamic from "next/dynamic";
import styled from "styled-components";

const Login = dynamic(() => import('@/components/Login'), { ssr: false });
const PayPreview = dynamic(() => import('@/modules/PayPreview'), { ssr: false });

const StyledAppConnect = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;

  > div + div {
    margin-top: 3rem;
  }

  .lens-options {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    > div.mini-profile {
      overflow-wrap: break-word;
      white-space: normal;
      width: 21%;
      margin: 0.5rem 0;

      img {
        &:hover {
        cursor: pointer;
        border: 2px solid #abfe2c;
      }
      }

      p.label {
        text-align: center;
        font-size: 0.55rem;
        width: 12ch;
      }
    }
  }
`

const AppHome = () => {
  return (
    <StyledAppConnect className='app-connect'>
      <Login />
      <PayPreview />
    </StyledAppConnect>
  );
};

export default AppHome;

import PayUserPreview from "@/components/PayUserPreview"
import PayUserSelect from "@/components/PayUserSelect"
import useGetPayData from "@/hooks/useGetPayData"


const PayPreview = () => {
  const { set_id, toProfile } = useGetPayData()
  return (
    <>
      <PayUserPreview profile={toProfile} />
      <PayUserSelect setValue={set_id} />
    </>
  )
}

export default PayPreview

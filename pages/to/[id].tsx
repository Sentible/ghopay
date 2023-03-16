import { useRouter } from "next/router";


const ToReceiver = () => {

  const router = useRouter();

  const { id } = router.query;

  return (

    <div>

      <h1>Path: pages\to\[{id}].tsx</h1>

      <h2>id: {id}

      </h2>

    </div>

  );

}

export default ToReceiver;

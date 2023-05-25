import React from "react";
import { TbError404 } from "react-icons/tb";
import { CgSmileSad } from "react-icons/cg";

function Page404(props) {
  return (
    <div className="text-center display-7 fw-bold d-auto">
      <img className="my-5" src="/images/logo.png" alt="inbar logo" />
      <h1>
        <TbError404 size={"1.5em"} /> Error
      </h1>
      <h2>
        <CgSmileSad /> Page Not Found
      </h2>
    </div>
  );
}

export default Page404;

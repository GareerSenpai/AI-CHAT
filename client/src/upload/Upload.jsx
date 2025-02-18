import React, { useRef } from "react";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_ENDPOINT;
const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_BASE_URL}/api/upload`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

function Upload({ setImg }) {
  const ikUploadRef = useRef(null);

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
    console.log("Success", res);
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    setImg((prev) => ({ ...prev, isLoading: true }));
    console.log("Start", evt);
  };
  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        useUniqueFileName={true}
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />
      <label
        // htmlFor="attachment"
        className="p-[12px] rounded-[50%] bg-[#605e68] flex justify-center items-center ml-3 cursor-pointer"
        onClick={() => ikUploadRef.current.click()}
      >
        <img src="/attachment.png" alt="attachment" className="w-4 h-4" />
      </label>
    </IKContext>
  );
}

export default Upload;

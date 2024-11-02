import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import Favicon from "./Favicon";
import { toast } from "react-toastify";
import {
  useAddLogoMutation,
  useGetLogoQuery,
  useUpdateLogoMutation,
} from "../../../../Redux/api/logoApi";
import Swal from "sweetalert2";

export default function Logo() {
  const [images, setImages] = useState([]);

  const { data, isLoading } = useGetLogoQuery();
  let id = data?.data?._id;

  const [addLogo, { isLoading: addLoading }] = useAddLogoMutation();
  const [updateLogo, { isLoading: updateLoading }] = useUpdateLogoMutation();

  const handleAdd = async (e) => {
    e.preventDefault();

    let logo = images[0]?.file;

    if (!logo) return Swal.fire("", "Logoe is required!", "warning");

    const formData = new FormData();
    formData.append("logo", logo);

    if (!id) {
      let res = await addLogo(formData);
      if (res?.data?.success) {
        toast.success("Logo add success");
        setImages([]);
      } else {
        toast.error("something went wrong!");
        console.log(res);
      }
    } else {
      let res = await updateLogo({ id, formData });
      if (res?.data?.success) {
        toast.success("Logo update success");
        setImages([]);
      } else {
        toast.error("something went wrong!");
        console.log(res);
      }
    }
  };

  if (isLoading) return "Loading...";

  return (
    <section>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-base-100 shadow rounded">
          <div className="p-4 border-b text-neutral font-medium flex justify-between items-center">
            <h3>Add Logo</h3>
          </div>

          <form onSubmit={handleAdd} className="p-4">
            <div>
              <p className="mb-1">Logo</p>
              <div>
                <ImageUploading
                  defaultValue={images}
                  onChange={(icn) => setImages(icn)}
                  dataURLKey="data_url"
                >
                  {({ onImageUpload, onImageRemove, dragProps }) => (
                    <div
                      className="border rounded border-dashed p-4 md:flex items-center gap-10"
                      {...dragProps}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          onClick={onImageUpload}
                          className="w-max px-4 py-1.5 rounded-2xl text-base-100 bg-primary cursor-pointer text-sm"
                        >
                          Choose Image
                        </span>

                        <p className="text-neutral-content">or Drop here</p>
                      </div>

                      <div className={`${images?.length > 0 && "mt-4"} `}>
                        {images?.map((img, index) => (
                          <div key={index} className="image-item relative">
                            <img
                              src={img["data_url"]}
                              alt=""
                              className="w-32 h-20"
                            />
                            <div
                              onClick={() => onImageRemove(index)}
                              className="w-7 h-7 bg-primary rounded-full flex justify-center items-center text-base-100 absolute top-0 right-0 cursor-pointer"
                            >
                              <AiFillDelete />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ImageUploading>
              </div>
            </div>
            <div className="mt-4">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/logo/${
                  data?.data?.logo
                }`}
                alt=""
                className="w-32"
              />
            </div>

            <div className="mt-5">
              <button
                disabled={updateLoading && "disabled"}
                className="primary_btn"
              >
                {updateLoading || addLoading
                  ? "Loading"
                  : id
                  ? "Update"
                  : "Add"}
              </button>
            </div>
          </form>
        </div>

        <Favicon />
      </div>
    </section>
  );
}

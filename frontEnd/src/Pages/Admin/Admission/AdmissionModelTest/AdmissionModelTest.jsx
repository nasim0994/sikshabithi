import { FaRegEdit } from "react-icons/fa";

import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import {
  useDeleteAdmissionModelTestMutation,
  useGetAdmissionModelTestQuery,
} from "../../../../Redux/api/admission/admissionModelTestApi";

export default function AdmissionModelTest() {
  const { data, isLoading } = useGetAdmissionModelTestQuery();
  let modelTests = data?.data;

  console.log(data);

  const [deleteExamModelTest] = useDeleteAdmissionModelTestMutation();
  const handleDelete = async (id) => {
    let isConfirm = window.confirm("are you sure delete this set?");
    if (isConfirm) {
      let res = await deleteExamModelTest(id);
      if (res?.data?.success) {
        toast.success("Model test delete success");
      } else {
        toast.error("something went wrong!");
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-base-100 shadow rounded">
      <div className="flex justify-between items-center p-3">
        <h2>Admission Model Test</h2>
        <Link to="/admin/admission/modelTest/add" className="secondary_btn">
          Add New
        </Link>
      </div>

      <div className="relative overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Model Test Name</th>
              <th>University</th>
              <th>Total Question</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {modelTests?.length > 0 ? (
              modelTests?.map((modelTest, i) => (
                <tr key={modelTest?._id}>
                  <td>{i + 1}</td>
                  <td>{modelTest?.name}</td>
                  <td>{modelTest?.university?.name}</td>
                  <td>{modelTest?.mcqs?.length}</td>
                  <td
                    className={`${
                      modelTest?.examType == "free"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {modelTest?.examType}
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-lg">
                      <Link
                        to={`/admin/admission/modeltest/edit/${modelTest?._id}`}
                        className="hover:text-primary"
                      >
                        <FaRegEdit />
                      </Link>

                      <button
                        onClick={() => handleDelete(modelTest?._id)}
                        className="hover:text-red-500"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <p className="p-3 text-sm text-red-500">No Data Found!</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

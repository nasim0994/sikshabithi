import { Link, useParams } from "react-router-dom";
import { useGetSingleAdmissionModelTestQuery } from "../../../../Redux/api/admission/admissionModelTestApi";
import BackBtn from "../../../../Components/BackBtn/BackBtn";
import ModelTestModal from "../../../../Components/UserLayoutComponents/Exam/ModelTestModal/ModelTestModal";
import { useState } from "react";

export default function AdmissionExamDetails() {
  let { id } = useParams();
  const { data } = useGetSingleAdmissionModelTestQuery(id);
  let modelTest = data?.data;

  const [modelModal, setModelModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState({});

  console.log(modelTest);

  return (
    <div className="bg-base-100 rounded shadow">
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="text-primary text-lg font-semibold hover:text-green-500 duration-300">
          {modelTest?.name}
        </h2>

        <BackBtn />
      </div>

      <div className="p-3">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-neutral/90 text-[13px]">
          <div className="flex gap-4 items-center">
            <span>University:</span> <span>{modelTest?.university?.name}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Question Set:</span> <span>{modelTest?.set?.name}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Vendor:</span> <span>{modelTest?.vendor}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Examiner:</span> <span>{modelTest?.examiner}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Exam type:</span> <span>{modelTest?.examType}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Status:</span> <span>{modelTest?.status}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Participated:</span> <span>{modelTest?.participated}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Total Question:</span> <span>{modelTest?.mcqs?.length}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Total Mark:</span> <span>{modelTest?.totalMark}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Pass Mark:</span> <span>{modelTest?.passMark}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Negative Mark:</span> <span>{modelTest?.negativeMark}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span>Duration:</span> <span>{modelTest?.duration} min.</span>
          </div>
        </div>
      </div>

      <div className="border-t p-3 flex justify-between items-center text-xs font-medium">
        {modelTest?.examType == "free" ? (
          <>
            <button
              onClick={() => {
                setModelModal(true);
                setSelectedModel(modelTest);
              }}
              className="bg-green-500  hover:bg-green-600 text-base-100 px-2 py-1 rounded duration-200"
            >
              Start Now
            </button>
            <ModelTestModal
              model={selectedModel}
              modelModal={modelModal}
              setModelModal={setModelModal}
              category="admission"
            />
          </>
        ) : (
          <Link
            to=""
            className="bg-red-500 hover:bg-red-600 text-base-100 px-2 py-1 rounded duration-200"
          >
            Buy Package
          </Link>
        )}
      </div>
    </div>
  );
}

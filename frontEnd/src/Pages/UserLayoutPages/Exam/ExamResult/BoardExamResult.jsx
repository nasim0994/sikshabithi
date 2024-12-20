import { Link } from "react-router-dom";
import moment from "moment";
import { FaAward, FaBookmark, FaQuestion, FaCheck } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdInfo, MdClose } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import { IoBookmarks } from "react-icons/io5";
import { useState } from "react";
import { useGetBoardExamResultQuery } from "../../../../Redux/api/board/boardExamResultApi";
import { useSelector } from "react-redux";
import Pagination from "../../../../Components/Pagination/Pagination";
import ExamResultHead from "./ExamResultHead";

export default function BoardExamResult() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const { loggedUser } = useSelector((store) => store?.user);

  const [currentPage, setCurrentPage] = useState(1);
  let limit = 10;

  let query = {};
  query["user"] = loggedUser?.data?._id;
  query["limit"] = limit;
  query["page"] = currentPage;

  const { data } = useGetBoardExamResultQuery({ ...query });
  const mcqs = data?.data;

  return (
    <div>
      <ExamResultHead />

      <div className="mt-2 bg-base-100 rounded shadow p-4">
        <div className="grid md:grid-cols-2 items-start gap-4">
          {mcqs?.map((mcq) => (
            <div
              key={mcq?._id}
              className="bg-base-100 rounded overflow-hidden shadow border border-primary"
            >
              <button
                onClick={() => {
                  setOpen(!open);
                  setActive(mcq?._id);
                }}
                className="w-full bg-gray-100 text-neutral p-4 py-3 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-medium">Board Exam</h2>
                  <p className="text-xs text-neutral-content">
                    Time: {moment(mcq?.createdAt).fromNow()}
                  </p>
                </div>
                <button>
                  <MdOutlineKeyboardArrowDown />
                </button>
              </button>

              <div
                className={`${
                  open && active == mcq?._id ? "h-max" : "h-0 overflow-hidden"
                } duration-300`}
              >
                <div className="p-4 grid grid-cols-2 gap-3 text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/80 text-base-100 p-2 rounded">
                      <FaQuestion />
                    </div>
                    <div>
                      <p>{mcq?.mcqs?.length}</p>
                      <p className="text-neutral-content text-xs">
                        TOTAL QUESTION
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-primary/80 text-base-100 p-2 rounded">
                      <IoBookmarks />
                    </div>
                    <div>
                      <p>{mcq?.mcqs?.length}</p>
                      <p className="text-neutral-content text-xs">TOTAL MARK</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-primary/80 text-base-100 p-2 rounded">
                      <FaListCheck />
                    </div>
                    <div>
                      <p>
                        {mcq?.result?.totalRightAns +
                          mcq?.result?.totalWrongAns}
                      </p>
                      <p className="text-neutral-content text-xs">ANSWERED</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-primary/80 text-base-100 p-2 rounded">
                      <FaCheck />
                    </div>
                    <div>
                      <p>{mcq?.result?.totalRightAns}</p>
                      <p className="text-neutral-content text-xs">
                        RIGHT ANSWER
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-primary/80 text-base-100 p-2 rounded">
                      <MdClose />
                    </div>
                    <div>
                      <p>{mcq?.result?.totalWrongAns}</p>
                      <p className="text-neutral-content text-xs">
                        WRONG ANSWER
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-secondary/80 text-base-100 p-2 rounded">
                      <FaAward />
                    </div>
                    <div>
                      <p>{mcq?.result?.obtainMark}</p>
                      <p className="text-neutral-content text-xs">
                        OBTAIN MARK
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-primary/80 text-base-100 p-2 rounded">
                      <FaBookmark />
                    </div>
                    <div>
                      <p>{mcq?.passMark}</p>
                      <p className="text-neutral-content text-xs">PASS MARK</p>
                    </div>
                  </div>
                </div>

                <div className="border-t px-3 py-2 flex justify-between items-center text-xs uppercase text-base-100">
                  <div>
                    {mcq?.result?.resultType == "PASS" ? (
                      <span className="bg-primary px-2 py-1 rounded">
                        Passes
                      </span>
                    ) : (
                      <span className="bg-red-500 px-2 py-1 rounded">
                        Failed
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/exam-result/details/boardexam/${mcq?._id}`}
                    className="bg-gray-300 text-neutral px-2 py-1 rounded flex items-center gap-1"
                  >
                    <MdInfo className="text-[15px]" /> Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {data?.meta?.pages > 1 && (
          <Pagination
            pages={data?.meta?.pages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

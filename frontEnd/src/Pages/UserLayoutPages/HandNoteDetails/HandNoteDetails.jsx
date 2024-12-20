import { Link, useParams } from "react-router-dom";
import BackBtn from "../../../Components/BackBtn/BackBtn";
import moment from "moment";
import { useGetHandNoteQuery } from "../../../Redux/api/handnotesApi";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FaFacebook,
  FaTelegram,
  FaLinkedin,
  FaWhatsappSquare,
  FaShareAlt,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";
import HandNoteDownload from "../../../Components/UserLayoutComponents/HandNoteDownload/HandNoteDownload";
import RelatedHandNote from "./RelatedHandNote";

export default function HandNoteDetails() {
  window.scrollTo(0, 0);

  const { id } = useParams();
  const { data } = useGetHandNoteQuery(id);
  const note = data?.data;

  const [shareDropdown, setShareDropdown] = useState(false);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (!e.target.closest(".sharebtn")) {
        setShareDropdown(null);
      }
    });
  }, [shareDropdown]);

  let createdAt = note?.createdAt;
  const timeAgoCreatedAt = moment(createdAt).fromNow();

  return (
    <section className="grid md:grid-cols-3 gap-4 items-start">
      <div className="md:col-span-2">
        <div className="bg-base-100 shadow rounded p-3">
          <div className="flex justify-between items-center">
            <Link to="/handnote/add" className="text-xs primary_btn">
              Add HandNote
            </Link>

            <div className="flex items-center gap-3">
              <button className="shadow hover:bg-primary/20 duration-200 w-7 h-7 flex justify-center items-center rounded">
                <HandNoteDownload id={note?._id} />
              </button>
              <BackBtn />
            </div>
          </div>
        </div>

        <div className="mt-2 bg-base-100 shadow rounded ">
          <div className="p-3 border-b flex justify-between items-center">
            <Link
              to={`/handnotes?active=${note?.category}`}
              className="text-sm text-neutral-content hover:underline"
            >
              {note?.category}
            </Link>
            <p className="mt-1 text-xs text-neutral-content">
              Created: {timeAgoCreatedAt}
            </p>
          </div>

          <div className="p-3">
            <h2 className="font-medium text-sm sm:text-2xl">{note?.title}</h2>
            <p className="text-neutral-content">{note?.description}</p>

            <PhotoProvider>
              {note?.images?.map((img) => (
                <PhotoView
                  key={img?._id}
                  src={`${import.meta.env.VITE_BACKEND_URL}/handnotes/${img}`}
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/handnotes/${img}`}
                    alt=""
                    className="w-full rounded mt-2 border"
                  />
                </PhotoView>
              ))}
            </PhotoProvider>

            <div className="mt-2 flex items-center justify-between">
              <div>
                <img
                  src={
                    note?.user?.profile?.image
                      ? `${import.meta.env.VITE_BACKEND_URL}/user/image/${
                          note?.user?.profile?.image
                        }`
                      : `/images/demo_user.png`
                  }
                  alt=""
                  className="w-9 h-9 rounded-full"
                />
                <div>
                  <p className="text-neutral-content text-xs">Post by</p>
                  <h2 className="text-neutral">{note?.user?.profile?.name}</h2>
                </div>
              </div>
              <div className="text-base relative">
                <button
                  onClick={() => setShareDropdown(!shareDropdown)}
                  className="sharebtn"
                >
                  <FaShareAlt />
                </button>

                {shareDropdown && (
                  <div className="absolute right-0 top-5 min-w-40 px-3 py-2 rounded bg-base-100 shadow">
                    <div className="flex items-center gap-2">
                      <p>share:</p>
                      <div className="mt-2 sm:mt-0 flex gap-2">
                        <FacebookShareButton
                          url={`${
                            import.meta.env.VITE_FRONTEND_URL
                          }/handnotes/${note?._id}`}
                        >
                          <FaFacebook className="text-xl text-blue-600" />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={`${
                            import.meta.env.VITE_FRONTEND_URL
                          }/handnotes/${note?._id}`}
                        >
                          <FaSquareXTwitter className="text-xl" />
                        </TwitterShareButton>
                        <TelegramShareButton
                          url={`${
                            import.meta.env.VITE_FRONTEND_URL
                          }/handnotes/${note?._id}`}
                        >
                          <FaTelegram className="text-xl text-sky-500" />
                        </TelegramShareButton>
                        <LinkedinShareButton
                          url={`${
                            import.meta.env.VITE_FRONTEND_URL
                          }/handnotes/${note?._id}`}
                        >
                          <FaLinkedin className="text-xl text-sky-400" />
                        </LinkedinShareButton>
                        <WhatsappShareButton
                          url={`${
                            import.meta.env.VITE_FRONTEND_URL
                          }/handnotes/${note?._id}`}
                        >
                          <FaWhatsappSquare className="text-xl text-green-500" />
                        </WhatsappShareButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedHandNote category={note?.category} />
    </section>
  );
}

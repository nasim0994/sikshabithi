import { Link } from "react-router-dom";
import { BiLogoFacebook, BiLogoLinkedin } from "react-icons/bi";
import { FaTwitter, FaInstagram } from "react-icons/fa";
import { useGetFounderSpeechQuery } from "../../../Redux/api/founderSpeechApi";
import FounderSkeleton from "../../Skeleton/HomeSkeleton/FounderSkeleton";

export default function FounderSpeech() {
  const { data, isLoading } = useGetFounderSpeechQuery();
  const speech = data?.data;

  if (isLoading) return <FounderSkeleton />;

  return (
    <section className="py-5 sm:py-10 bg-[#F2F7FD]">
      <div className="container">
        <div className="grid md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold text-neutral">
              {speech?.name || "Nasim Uddin"}
            </h2>
            <h4 className="text-primary text-lg mt-2">
              Founder & CEO of Shiksha Bithi
            </h4>

            <h5 className="text-neutral/90 text-sm sm:text-[15px] mt-4">
              {speech?.speech}
            </h5>

            <div className="mt-4">
              <button className="primary_btn">Contact Me</button>
            </div>
          </div>

          <div>
            <div className="bg-primary md:w-80 h-80 flex justify-center items-center ml-auto rounded">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/founder/${
                  speech?.image
                }`}
                alt="founder"
                className="w-[90%] h-[90%] rounded"
                loading="lazy"
              />
            </div>

            <div className="mt-4 flex gap-3 items-center justify-end">
              <p className="text-neutral-content pr-[90px]">Follow on</p>
              <Link
                to={speech?.facebook}
                target="_blank"
                className="w-7 h-7 rounded-full bg-primary flex justify-center items-center text-base-100 hover:-mt-1 duration-200"
              >
                <BiLogoFacebook className="text-lg" />
              </Link>
              <Link
                to={speech?.linkedin}
                target="_blank"
                className="w-7 h-7 rounded-full bg-primary flex justify-center items-center text-base-100 hover:-mt-1 duration-200"
              >
                <BiLogoLinkedin className="text-lg" />
              </Link>
              <Link
                to={speech?.twitter}
                target="_blank"
                className="w-7 h-7 rounded-full bg-primary flex justify-center items-center text-base-100 hover:-mt-1 duration-200"
              >
                <FaTwitter className="text-lg" />
              </Link>
              <Link
                to={speech?.instagram}
                target="_blank"
                className="w-7 h-7 rounded-full bg-primary flex justify-center items-center text-base-100 hover:-mt-1 duration-200"
              >
                <FaInstagram className="text-lg" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

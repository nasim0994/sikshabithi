import QuestionCountdown from "/src/assets/images/banner/exam.png";
import StudentCountdown from "/src/assets/images/banner/user.png";
import ExamCountdown from "/src/assets/images/banner/content.png";
import {
  useGetBannerCountQuery,
  useGetBannerQuery,
} from "../../../Redux/api/bannerApi";

export default function Hero() {
  const { data, isLoading } = useGetBannerQuery();
  const banner = data?.data;

  const { data: count } = useGetBannerCountQuery();
  const bannerCount = count?.data;
  const totalQuestion = bannerCount?.totalQuestion || 0;
  const totalUser = bannerCount?.totalUser || 0;
  const totalContent = bannerCount?.totalContent || 0;

  if (isLoading)
    return <div className="w-full h-[50vh] md:h-[75vh] bg-black/90"></div>;

  return (
    <div className="h-[50vh] md:h-[75vh] relative overflow-hidden">
      <div className="relative h-full">
        {/* bg */}
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/banner/${banner?.bg}`}
          alt="banenrBg"
          className="absolute w-full h-full"
          loading="lazy"
        />

        {/* Content */}
        <div className="w-full h-full flex flex-col justify-center items-center relative z-30 bg-[#000000b1]">
          <div className="flex flex-col items-center justify-center sm:gap-3">
            <h3 className="text-2xl md:text-4xl font-bold text-base-100">
              {banner?.title}
            </h3>
            <h2 className="sm:w-2/3 text-center mt-2 text-base-100/70">
              {banner?.subTitle}
            </h2>
          </div>

          {/* Counter */}
          <div className="mt-5 w-[90%] lg:w-1/2 bg-primary/5 rounded-lg mx-auto py-6 md:py-10 px-2 md:px-4 grid grid-cols-3 gap-6">
            <div className="border-r border-primary/40 flex items-center justify-center gap-1 md:gap-3">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-primary flex justify-center items-center">
                <img
                  src={QuestionCountdown}
                  alt="QuestionCountdown"
                  className="w-[90%] h-[90%] object-cover"
                />
              </div>
              <div>
                <h2 className="md:text-xl font-bold text-base-100">
                  {totalQuestion >= 1000
                    ? (totalQuestion / 1000).toFixed(1) + "K"
                    : totalQuestion}
                  +
                </h2>
                <h3 className="text-xs md:text-sm text-base-100/40">প্রশ্ন</h3>
              </div>
            </div>

            <div className="border-r border-primary/40 flex items-center justify-center gap-1 md:gap-3">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-primary flex justify-center items-center">
                <img
                  src={StudentCountdown}
                  alt="Student Countdown"
                  className="w-[90%] h-[90%] object-cover"
                />
              </div>
              <div>
                <h2 className="md:text-xl font-bold text-base-100">
                  {totalUser}+
                </h2>
                <h3 className="text-xs md:text-sm text-base-100/40">
                  শিক্ষার্থী
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 md:gap-3">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-primary flex justify-center items-center">
                <img
                  src={ExamCountdown}
                  alt="Exam Countdown"
                  className="w-[90%] h-[90%] object-cover"
                />
              </div>
              <div>
                <h2 className="md:text-xl font-bold text-base-100">
                  {totalContent >= 1000
                    ? (totalContent / 1000).toFixed(1) + "K"
                    : totalContent}
                  +
                </h2>
                <h3 className="text-xs md:text-sm text-base-100/40">কনটেন্ট</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

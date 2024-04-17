import { PiCloudSun, PiSun, PiSunDim } from "react-icons/pi";

export function WeeakWeather({
  location,
  weather,
}: {
  location: string;
  weather: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}) {
  return (
    <div className="ring-1 ring-secondary rounded-lg rounded-tl-none w-full">
      <h1 className="p-1 px-4 border-b border-secondary rounded-md">
        Weather in <span className="font-semibold text-xl">{location}</span>{" "}
        this week.
      </h1>
      <div className="flex flex-col w-full justify-between items-center">
        <div className="flex flex-col gap-1 w-full py-2">
          <div className="px-10 w-full">
            <span className="px-2 bg-accent rounded-lg text-sm font-light w-fit">
              Monday
            </span>
          </div>
          <div className="flex w-full justify-between px-12 border-b border-muted items-center">
            <PiSun className="text-secondary" size={50} />
            <span>
              <b className="text-lg">{weather.monday}</b>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full py-2">
          <div className="px-10 w-full">
            <span className="px-2 bg-accent rounded-lg text-sm font-light w-fit">
              Tuesday
            </span>
          </div>
          <div className="flex w-full justify-between px-12 border-b border-muted items-center">
            <PiCloudSun className="text-secondary" size={50} />
            <span>
              <b className="text-lg">{weather.tuesday}</b>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full py-2">
          <div className="px-10 w-full">
            <span className="px-2 bg-accent rounded-lg text-sm font-light w-fit">
              Wednesday
            </span>
          </div>
          <div className="flex w-full justify-between px-12 border-b border-muted items-center">
            <PiSun className="text-secondary" size={50} />
            <span>
              <b className="text-lg">{weather.wednesday}</b>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full py-2">
          <div className="px-10 w-full">
            <span className="px-2 bg-accent rounded-lg text-sm font-light w-fit">
              Thursday
            </span>
          </div>
          <div className="flex w-full justify-between px-12 border-b border-muted items-center">
            <PiSunDim className="text-secondary" size={50} />
            <span>
              <b className="text-lg">{weather.thursday}</b>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full py-2">
          <div className="px-10 w-full">
            <span className="px-2 bg-accent rounded-lg text-sm font-light w-fit">
              Friday
            </span>
          </div>
          <div className="flex w-full justify-between px-12 border-b border-muted items-center">
            <PiSunDim className="text-secondary" size={50} />
            <span>
              <b className="text-lg">{weather.friday}</b>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full py-2">
          <div className="px-10 w-full">
            <span className="px-2 bg-accent rounded-lg text-sm font-light w-fit">
              Saturday
            </span>
          </div>
          <div className="flex w-full justify-between px-12 border-b border-muted items-center">
            <PiSunDim className="text-secondary" size={50} />
            <span>
              <b className="text-lg">{weather.saturday}</b>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full py-2">
          <div className="px-10 w-full">
            <span className="px-2 bg-accent rounded-lg text-sm font-light w-fit">
              Sunday
            </span>
          </div>
          <div className="flex w-full justify-between px-12 items-center">
            <PiSunDim className="text-secondary" size={50} />
            <span>
              <b className="text-lg">{weather.sunday}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { classNames } from "@/utils";

interface LiveProps {
  isLive: boolean;
  className?: string;
}

export const LiveIndicator: React.FC<LiveProps> = ({ isLive, className }) => {
  return (
    <div
      className={classNames(
        className,
        "inline-flex flex-col justify-between items-center h-[1em] w-[1em] aspect-square"
      )}
    >
      {isLive ? (
        <div className="rounded-full h-[50%] aspect-square bg-[oklch(from_var(--theme-color)_0.54_c_h)]">
          <div className="rounded-full bg-[oklch(from_var(--theme-color)_0.54_c_h)] aspect-square flex justify-evenly items-center animate-ping" />
        </div>
      ) : (
        <div className="h-[45%] w-full flex justify-center items-center">
          <div className="text-[45%] leading-[1em] font-mono text-stone-700 text-opacity-80">
            NOT
          </div>
        </div>
      )}

      <div className="h-[45%] w-full flex justify-center items-center">
        <div
          className={classNames("text-[45%] leading-[1em] font-mono", {
            "text-stone-700 text-opacity-80": !isLive,
          })}
        >
          LIVE
        </div>
      </div>
    </div>
  );
};

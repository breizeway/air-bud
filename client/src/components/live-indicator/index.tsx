import { classNames } from "@/utils";

interface LiveProps {
  className?: string;
}

export const LiveIndicator: React.FC<LiveProps> = ({ className }) => {
  return (
    <div
      className={classNames(
        className,
        "inline-flex flex-col justify-between items-center h-[1em] w-[1em] aspect-square"
      )}
    >
      <div className="rounded-full bg-[oklch(from_var(--theme-color)_0.54_c_h)] h-[50%] aspect-square">
        <div className="rounded-full bg-[oklch(from_var(--theme-color)_0.54_c_h)] aspect-square flex justify-evenly items-center animate-ping" />
      </div>
      <div className="h-[45%] w-full flex justify-center items-center">
        <div className="text-[45%] leading-[1em] font-mono ">LIVE</div>
      </div>
    </div>
  );
};

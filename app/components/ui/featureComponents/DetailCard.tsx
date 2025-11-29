interface DetailProps {
  title: string;
  value: string | number | undefined;
  unit?: React.ReactNode;
}

export const Detail = ({ title, value, unit }: DetailProps) => {
  return (
    <div className="text-base">
      <p className="font-semibold text-secondary-indigo-04">{title}</p>
      <div className="font-normal text-secondary-dark-gray-04">
        {/* {value !== undefined && value !== "" ? `${value} ${unit || ""}` : "-"} */}
        {value !== undefined && value !== "" ? (
          <p className="flex gap-1 line-clamp-1">
            {value} {unit && typeof unit === "string" ? unit : unit}
          </p>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
};

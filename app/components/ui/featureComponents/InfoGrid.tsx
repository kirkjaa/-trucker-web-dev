import { Detail } from "./DetailCard";

interface InfoGridProps {
  details: {
    title: string;
    value: string | number | undefined;
    unit?: React.ReactNode;
  }[];
}

export const InfoGrid = ({ details }: InfoGridProps) => {
  return (
    <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
      {details.map((detail, index) => (
        <Detail
          key={index}
          title={detail.title}
          value={detail.value}
          unit={detail.unit}
        />
      ))}
    </div>
  );
};

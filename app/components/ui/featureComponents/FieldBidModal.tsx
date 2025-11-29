interface FieldBidModalProps {
  title: string;
  value: string;
}

export const FieldBidModal = ({ title, value }: FieldBidModalProps) => {
  return (
    <div className="flex gap-1">
      <p className="text-base font-semibold">{title}</p>
      <p className="text-base font-normal">{value}</p>
    </div>
  );
};

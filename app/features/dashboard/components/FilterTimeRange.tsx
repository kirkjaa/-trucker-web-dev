import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export default function FilterTimeRange() {
  return (
    <div className="bg-neutral-01 flex justify-between p-5 rounded-lg">
      <div className="flex gap-2">
        <Button variant="timeRange" size="timeRange">
          วัน
        </Button>
        <Button variant="timeRange" size="timeRange">
          สัปดาห์
        </Button>
        <Button variant="timeRange" size="timeRange">
          เดือน
        </Button>
        <Button variant="timeRange" size="timeRange">
          ปี
        </Button>
      </div>

      <Select>
        <SelectTrigger className="w-28 border border-neutral-03">
          <SelectValue placeholder="กรุณาเลือก" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="2568">2568</SelectItem>
            <SelectItem value="2567">2567</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

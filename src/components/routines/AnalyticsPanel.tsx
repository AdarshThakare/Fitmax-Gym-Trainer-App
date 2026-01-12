import CornerElements from "./CornerElements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";

import OverviewChart from "./OverviewChart";
import DistributionChart from "./DistributionChart";
import VolumeChart from "./VolumeChart";
import TrendsChart from "./TrendsChart";

interface Props {
  progressData: any[];
  volumeData: any[];
  pieData: any[];
}

const AnalyticsPanel = ({ progressData, volumeData, pieData }: Props) => {
  return (
    <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
      <CornerElements />

      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-mono font-bold text-primary">PROGRESS ANALYTICS</h3>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewChart data={progressData} />
        </TabsContent>

        <TabsContent value="distribution">
          <DistributionChart data={pieData} />
        </TabsContent>

        <TabsContent value="volume">
          <VolumeChart data={volumeData} />
        </TabsContent>

        <TabsContent value="trends">
          <TrendsChart data={progressData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPanel;

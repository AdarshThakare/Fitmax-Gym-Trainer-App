import { USER_PROGRAMS } from "@/constants";
import ProgramDetailPage from "./ProgramDetail";

export function generateStaticParams() {
  return USER_PROGRAMS.map((program) => ({
    id: program.id.toString(),
  }));
}

export default function Page() {
  return <ProgramDetailPage />;
}

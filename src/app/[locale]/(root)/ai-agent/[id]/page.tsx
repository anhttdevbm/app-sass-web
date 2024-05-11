import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Agent",
  };
}
export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        AI AGENT DETAIL
      </div>
    </>
  );
}

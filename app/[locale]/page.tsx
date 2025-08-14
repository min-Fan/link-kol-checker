import Home from "./main";
import MainLayout from "./main/layout";

export default function HomePage() {
  return (
    <div className="w-full h-full">
      <MainLayout>
        <Home />
      </MainLayout>
    </div>
  );
}

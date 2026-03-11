import BottomNav from "./BottomNav";

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <div className="pb-20">{children}</div>
      <BottomNav />
    </div>
  );
};

export default MobileLayout;

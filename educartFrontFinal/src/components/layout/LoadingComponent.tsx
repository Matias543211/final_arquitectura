export const LoadingComponent = () => {
  return (
    <div className="flex-col gap-4 w-full h-svh flex items-center justify-center dark:bg-neutral-900">
      <div className="w-20 h-20 border-8 border-transparent text-indigo-500 text-5xl animate-spin flex items-center justify-center border-t-indigo-400 rounded-full">
        <div className="w-16 h-16 border-8 border-transparent text-purple-500 text-4xl animate-spin flex items-center justify-center border-t-purple-400 rounded-full"></div>
      </div>
    </div>
  );
};

import { useRouter } from "next/navigation";

export const useNavigator = (path: string, options: object) => {
  const router = useRouter();

  return () => {
    router.push(path, options);
  };
};

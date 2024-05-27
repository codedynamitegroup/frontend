import { useLocation } from "react-router-dom";

function useGetPage(): number {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let pageString: string | null = queryParams.get("page");

  // Convert page to a number
  let page: number = Number(pageString);

  if (isNaN(page) || page < 0) {
    page = 0; // Default to the first question if page is not valid
  }

  return page;
}

export default useGetPage;

import { TablePaginationProps } from "../../../@types/web"

const Pagination = ({ totalProducts, productsPerPage, setCurrentPage, currentPage }: TablePaginationProps) => {
    /* https://www.youtube.com/watch?v=wAGIOCqS8tk&ab_channel=CodeBlessYou */
    let pages: number[] = []

    for(let i = 1; i <= Math.ceil(totalProducts/productsPerPage); i++) {
        pages.push(i)
    }
  return (
    <div>
        {pages.map((page, i) => (
            <button className="paginationButtons" key={i} id={page === currentPage ? 'active' : ''} onClick={() => setCurrentPage(page)}>{page}</button>
        ))}
    </div>
  )
}

export default Pagination
import { GiWallet } from "react-icons/gi";

interface CashLabelProps {
  totCash: number; 
}

export const CashLabel = ({ totCash }: CashLabelProps) => {
  return (
    <div className="absolute top-4 right-4 p-2 rounded-lg dark:bg-green-600 bg-purple-500 text-whiteModified font-semibold flex items-center gap-2">
     <GiWallet /> R$ {totCash.toFixed(2) || 0}
    </div>
  )
}

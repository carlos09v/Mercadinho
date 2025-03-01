import { ComponentProps, ReactElement } from "react"

interface InputIconProps extends ComponentProps<'span'> { }

// ---- WebProps

// -- SideBar
type SidebarType = 'header' | 'aside';

type SideBarIconProps = {
    icon: ReactElement<ComponentProps<'span'>>;
    text?: string;
    to?: string;
    styleTooltip?: string;
    isActive?: boolean;
    deleteCookie?: boolean;
    type: SidebarType;  // Usando o tipo reutilizável
    customClass?: string;
};

type SideBarProps = {
    type: SidebarType;  // Usando o tipo reutilizável
    visible: boolean;
    toggleStage: string;
    setToggleStage: (stage: string) => void;
};

type SettingsPageProps = {
    sidebarType: SidebarType;  // Usando o tipo reutilizável
    setSidebarType: (value: SidebarType) => void;
};


// -- Input
interface InputProps extends ComponentProps<'input'> {
    labelname?: string
    productNameIcon?: InputIconProps
    productPriceIcon?: InputIconProps
}

interface CountContextProps {
    countUser: number | null
    countCart: number | null
    productsCount: number | null
    setProductsCount: (value: React.SetStateAction<number | null>) => void
    getUsersCount: () => Promise<void>
    getCartsCount: () => Promise<void>
    getProductsUserCount: () => Promise<void>
    resetCounts: () => void
    cashCount: number
    setCashCount: (value: React.SetStateAction<number>) => void
}

/* Cart */
type TablePaginationProps = {
    totalProducts: number
    productsPerPage: number
    setCurrentPage: (value: React.SetStateAction<number>) => void
    currentPage: number
}

/* Payout */
type PayoutProps = {
    setCurrentStep: (value: React.SetStateAction<string>) => void
    setInputPayout?: (value: React.SetStateAction<string>) => void
    inputPayout: string
}

export type { SidebarType, SideBarIconProps, SideBarProps, SettingsPageProps, InputProps, CountContextProps, TablePaginationProps, PayoutProps }
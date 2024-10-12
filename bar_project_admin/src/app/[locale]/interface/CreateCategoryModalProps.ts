export interface CreateCategoryModalProps {
    modalStatus: boolean, 
    toggleModal: () => void, 
    fetchCategories: () => void, 
    CategoryNamePlaceholder: string,
    Confirm: string, 
    Cancel: string
}
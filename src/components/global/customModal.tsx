
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useModal } from "@/providers/modal-provider"
import { Button } from "../ui/button"


type props = {
  title: string
  subheading: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const CustomModal = ({ children, title, subheading, defaultOpen }: props) => {
  
  const { isOpen, setClose } = useModal()
  const handleClose = () => setClose() 
  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
    >
      <DrawerContent className="md:w-[70%] lg:w-[50%] w-full m-auto">
        <DrawerHeader>
          <DrawerTitle className="text-center">{title}</DrawerTitle>
          <DrawerDescription
            className="text-center flex flex-col items-center gap-4 h-96 overflow-scroll"
          >
            {subheading}
            {children}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter
          className="flex flex-col gap-4 bg-background border-t-[1px] border-t-muted"
        >
          {/* <Button>Submit</Button> */}
          //! This component is Button inside Button
          //! Decendent Error
          <DrawerClose>
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleClose}
            >Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CustomModal
import { Button } from "@heroui/button";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  modalDelete: React.ReactNode;
}

const PropertiesLayout = ({
  children,
  modalDelete,
}: Props) => {
  return (
    <>
      <div className="bg-primary-400 flex justify-between items-center p-2">
        <h2 className="text-white text-xl font-semibold px-2">
          Propriedades
        </h2>

        <Button color="secondary" as={Link} href="/user/properties/add">
          + Adicionar imóvel
        </Button>
      </div>

      {children}

      {modalDelete}
    </>
  );
};

export default PropertiesLayout;
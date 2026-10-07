import ModalDeleteProperty from "./ModalDeleteProperty";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const propertyId = Number(id);

  if (!Number.isInteger(propertyId)) {
    return null;
  }

  return (
    <ModalDeleteProperty
      propertyId={propertyId}
    />
  );
}
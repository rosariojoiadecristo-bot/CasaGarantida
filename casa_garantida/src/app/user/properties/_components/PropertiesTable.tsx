"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Chip, Table, Pagination, Button, Card, Tooltip } from "@heroui/react";

import { Propriedade } from "@/types/Propriedade";
import { EyeIcon } from "@heroicons/react/16/solid";
import { PencilIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/16/solid";

type Props = {
  properties: Propriedade[];
};

const statusColorMap: Record<string, "success" | "danger" | "warning" | "primary"> = {
  Disponível: "success", Indisponível: "danger", Arrendado: "warning", Vendido: "primary",
};

const columns = [
  { id: "name", name: "Nome" },
  { id: "preco", name: "Preço" },
  { id: "tipo", name: "Tipo" },
  { id: "localizacao", name: "Localização" },
  { id: "provincia", name: "Província" },
  { id: "status", name: "Status" },
  { id: "actions", name: "Ações" },
];

const ROWS_PER_PAGE = 5;

const PropertiesTable = ({ properties }: Props) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(properties.length / ROWS_PER_PAGE)
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;

    return properties.slice(
      start,
      start + ROWS_PER_PAGE
    );
  }, [page, properties]);

  const start =
    properties.length > 0
      ? (page - 1) * ROWS_PER_PAGE + 1
      : 0;

  const end = Math.min(
    page * ROWS_PER_PAGE,
    properties.length
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO").format(price);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lista de Propriedades
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os imóveis cadastrados na plataforma.
          </p>
        </div>
      </div>

      <Card className="w-full overflow-hidden border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de propriedades
            </h2>
            <p className="text-sm text-gray-500">
              {properties.length}{" "}
              {properties.length === 1
                ? "propriedade cadastrada"
                : "propriedades cadastradas"}
            </p>
          </div>
        </div>

        <Table aria-label="Tabela de propriedades" className="w-full">
          <Table.ScrollContainer className="w-full overflow-x-auto">
            <Table.Content className="w-full">
              <Table.Header className="bg-gray-50">
                {columns.map((column) => (
                  <Table.Column
                    key={column.id}
                    id={column.id}
                    isRowHeader={column.id === "name"}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  >
                    {column.name}
                  </Table.Column>
                ))}
              </Table.Header>

              <Table.Body items={paginatedItems}>
                {(property) => {
                  const status =
                    property.status?.value ||
                    "Desconhecido";

                  const statusColor =
                    statusColorMap[status] ||
                    "primary";

                  return (
                    <Table.Row
                      key={property.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <Table.Cell className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {property.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            ID: {property.id}
                          </span>
                        </div>
                      </Table.Cell>

                      <Table.Cell className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {formatPrice(property.preco)} Kz
                        </span>
                      </Table.Cell>

                      <Table.Cell className="px-6 py-4">
                        <span className="text-gray-600">
                          {property.tipo?.value || "N/A"}
                        </span>
                      </Table.Cell>

                      <Table.Cell className="px-6 py-4">
                        <span className="text-gray-600">
                          {property.localizacao || "N/A"}
                        </span>
                      </Table.Cell>

                      <Table.Cell className="px-6 py-4">
                        <span className="text-gray-600">
                          {property.provincia || "N/A"}
                        </span>
                      </Table.Cell>

                      <Table.Cell className="px-6 py-4">
                        <Chip
                          color={statusColor}
                          size="sm"
                          variant="soft"
                        >
                          {status}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-4">
                          <Tooltip content="Detalhes">
                            <Link href={`/propriedade/${property.id}`}>
                            <EyeIcon className="w-5 text-slate-500"/>
                            </Link>
                          </Tooltip>
                          <Tooltip content="Editar" color="warning">
                            <Link href={`/user/properties/${property.id}/edit`}>
                            <PencilIcon className="w-5 text-yellow-500"/>
                            </Link>
                          </Tooltip>
                          <Tooltip content="Eliminar" color="danger">
                            <Link href={`/user/properties/${property.id}/delete`} scroll={false}>
                            <TrashIcon className="w-5 text-red-500"/>
                            </Link>
                          </Tooltip>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                }}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>

        {properties.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              🏠
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Nenhuma propriedade encontrada
            </h3>
            <p className="mt-1 max-w-md text-sm text-gray-500">
              Ainda não existem propriedades cadastradas.
              Adicione o seu primeiro imóvel para começar.
            </p>
          </div>
        )}

        {properties.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Mostrando{" "}
              <span className="font-medium text-gray-900">
                {start}
              </span>{" "}
              até{" "}
              <span className="font-medium text-gray-900">
                {end}
              </span>{" "}
              de{" "}
              <span className="font-medium text-gray-900">
                {properties.length}
              </span>{" "}
              resultados
            </p>
            
            <div className="flex w-full justify-center">
            <Pagination size="sm" className="justify-center">
              <Pagination.Content className="flex flex-row items-center justify-center gap-1">
                <Pagination.Item >
                  <Pagination.Previous
                    isDisabled={page === 1}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                    className="min-w-9 h-9 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">
                      Anterior
                    </span>
                  </Pagination.Previous>
                </Pagination.Item>
                {pages.map((p) => (
                  <Pagination.Item key={p}>
                    <Pagination.Link isActive={p === page} onPress={() => setPage(p)}
                    className={`min-w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${ p === page ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                    >
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}
                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={page === totalPages || totalPages === 0}
                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="min-w-9 h-9 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <div className="flex flex-col">
                        <span className="hidden sm:inline">
                          Seguinte
                        </span>
                    </div>
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PropertiesTable;
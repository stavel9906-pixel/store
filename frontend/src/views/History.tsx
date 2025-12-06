// ProductsTable.tsx
import {
  DataGrid,
  GridCellParams,
  GridColDef,
} from "@mui/x-data-grid";
import { Box, Modal, Typography } from "@mui/material";
import { useGetOrdersForUser } from "../api/hooks/useGetOrdersForUser";
import { useState } from "react";
import { CartCard } from "../components/CartCard/CartCard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { HistoryDetailsDTO } from "../utils/DTOs";
import { useGetIsAdmin } from "../api/hooks/useGetIsAdmin";
import { PurchaseStatus } from "../utils/enums";
import purchasesApi from "../api/purchasesApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "80%",
  overflowY: "auto",
  bgcolor: "#ce9cd4ff",
  borderRadius: 10,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const History = () => {
  const { orders } = useGetOrdersForUser();
  const [clickedOrder, setClickedOrder] = useState<HistoryDetailsDTO | null>(
    null
  );
  const { isAdmin } = useGetIsAdmin();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const commonColumns: GridColDef[] = [
    { field: "orderId", headerName: "Order Id", width: 120 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 160,
      sortComparator: (v1: string, v2: string) => {
        const parseDate = (str: string) => {
          const [day, month, year] = str.split(".").map(Number);
          return new Date(year, month - 1, day);
        };
        const date1 = parseDate(v1);
        const date2 = parseDate(v2);

        return date1.getTime() - date2.getTime();
      },
    },
    { field: "deliverTime", headerName: "Preffered Deliver Time", width: 220 },
    { field: "quantity", headerName: "Quantity", width: 120 },
    { field: "totalPrice", headerName: "Total Price ($)", width: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      editable: isAdmin,
      type: "singleSelect",
      valueOptions: Object.values(PurchaseStatus),
    },
  ];

  const columns: GridColDef[] = isAdmin
    ? [
        ...commonColumns,
        { field: "userId", headerName: "Customer Id", width: 140 },
        { field: "userName", headerName: "Full Name", width: 180 },
        { field: "phone", headerName: "Phone Number", width: 160 },
      ]
    : commonColumns;

  const handleCellClick = (params: GridCellParams) => {
    if (params.field === "status" && isAdmin) return;
    setClickedOrder(params.row);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        height: "80%",
        width: "95%",
        display: "flex",
        justifyContent: "center",
        m: "2rem",
      }}
    >
      <DataGrid
        rows={orders}
        getRowId={(row) => row.orderId}
        columns={columns}
        pagination
        pageSizeOptions={[5, 10, 25]}
        {...orders}
        processRowUpdate={async (newRow, oldRow) => {
          if (newRow.status !== oldRow.status) {
            await purchasesApi
              .purchases()
              .updateStatus(newRow.orderId, newRow.status);
          }
          return newRow;
        }}
        autoHeight={false}
        showToolbar
        disableRowSelectionOnClick
        onCellClick={handleCellClick}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            fontSize: "1.2rem",
            color: "#0080ffff",
          },
        }}
      />
      {clickedOrder && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <ListAltIcon sx={{ fontSize: 50 }} />

              <Typography
                variant="h2"
                fontWeight="bold"
                textAlign="center"
              >
                Order Items
              </Typography>

              <ListAltIcon sx={{ fontSize: 50 }} />
            </Box>
            {clickedOrder.purchaseProducts.map((order) => (
              <CartCard
                key={order.id}
                product={order}
                setSumPrice={null}
                onRemove={null}
              />
            ))}
            <Typography
              id="modal-modal-description"
              sx={{
                mt: 3,
                marginLeft: "40%",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              Total: ${clickedOrder.totalPrice}
            </Typography>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

// ProductsTable.tsx
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { Box, Modal, Typography } from "@mui/material";
import { useGetOrdersForUser } from "../api/hooks/useGetOrdersForUser";
import { useState } from "react";
import { CartCard } from "../components/CartCard/CartCard";
import { HistoryDetailsDTO } from "../utils/types";
import ListAltIcon from "@mui/icons-material/ListAlt";

const columns: GridColDef[] = [
  { field: "orderId", headerName: "Order Id", width: 200 },
  { field: "createdAt", headerName: "Created At", width: 200 },
  { field: "deliverTime", headerName: "Deliver Time", width: 200 },
  { field: "status", headerName: "Status", width: 200 },
  { field: "quantity", headerName: "Quantity", width: 200 },
  { field: "totalPrice", headerName: "Total Price ($)", width: 200 },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "80%",
  overflowY: "scroll",
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
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setClickedOrder(params.row);
    console.log(params.row.products);
    setOpen(true);
  };
  return (
    <Box
      sx={{
        height: 420,
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
        autoHeight
        showToolbar
        disableRowSelectionOnClick
        onRowClick={handleRowClick}
        {...orders}
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
}

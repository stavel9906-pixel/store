import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { Box, Modal, Paper, Typography } from "@mui/material";
import { useGetOrdersForUser } from "../api/hooks/useGetOrdersForUser";
import { useState } from "react";
import { CartCard } from "../components/CartCard/CartCard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { HistoryDetailsDTO } from "../utils/DTOs";
import { useGetIsAdmin } from "../api/hooks/useGetIsAdmin";
import { PurchaseStatus } from "../utils/enums";
import purchasesApi from "../api/purchasesApi";
import { useGetProductsAmount } from "../api/hooks/useGetProductsAmount";
import { useGetUsersAmount } from "../api/hooks/useGetUsersAmount";

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

const cardStyles = [
  { background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" },
  { background: "linear-gradient(135deg, #ff758c 0%, #ff8abbff 100%)" },
  { background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
];

export const History = () => {
  const { orders } = useGetOrdersForUser();
  const [clickedOrder, setClickedOrder] = useState<HistoryDetailsDTO | null>(
    null
  );
  const { isAdmin } = useGetIsAdmin();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { productsAmount } = useGetProductsAmount(isAdmin);
  const { usersAmount } = useGetUsersAmount(isAdmin);

  const commonColumns: GridColDef[] = [
    { field: "orderId", headerName: "Order Id", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
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
    { field: "deliverTime", headerName: "Preffered Deliver Time", flex: 1.5 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "totalPrice", headerName: "Total Price ($)", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      editable: isAdmin,
      type: "singleSelect",
      valueOptions: Object.values(PurchaseStatus),
    },
  ];

  const columns: GridColDef[] = isAdmin
    ? [
        ...commonColumns,
        { field: "userId", headerName: "Customer Id", flex: 1 },
        { field: "userName", headerName: "Full Name", flex: 1 },
        { field: "phone", headerName: "Phone Number", flex: 1 },
        { field: "country", headerName: "Country", flex: 1 },
        { field: "city", headerName: "City", flex: 1 },
        { field: "street", headerName: "Street", flex: 1 },
        { field: "houseNumber", headerName: "House Number", flex: 1 },
      ]
    : commonColumns;

  const handleCellClick = (params: GridCellParams) => {
    if (!(params.field === "status" && isAdmin)) {
      setClickedOrder(params.row);
      setOpen(true);
    }
  };

  return (
    <>
      {isAdmin && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            marginInline: "2rem",
            mt: 3,
          }}
        >
          {[
            { label: "Total Orders", value: orders.length },
            { label: "Total Products", value: productsAmount },
            { label: "Total Users", value: usersAmount },
          ].map((item, idx) => (
            <Paper
              key={item.label}
              sx={{
                flex: "1 1 30%",
                mr: 2,
                height: "7rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                borderRadius: 3,
                boxShadow: 3,
                ...cardStyles[idx],
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                {item.label}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {item.value}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
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
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
            columns: {
              columnVisibilityModel: {
                country: false, 
                city: false, 
                street: false,
                houseNumber: false
              },
            },
          }}
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
                  productPurchase={order}
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
    </>
  );
};

Prosess hanya yang di centang di cart;

Order 

-> untuk mengikat daata product yang ada pada cart

Order detail 

-> untuk mengikat data product yang ada pada cart detail 
-> stock Id

## Stock <-> Order Detail

ketika cart sudah dalam status process atau masuk kedalam fase order
jadi kita buatkan si cart ini sebuh stock, 

Stok 
qtyOut = 12; 

## Transaction 

Address [Mean] != addressID <T> Address data; 
Order->OrderId; 
Status; 
User->UserId;
Timestamp; 

## Payment 
Tampung semua yang ada dimidtrans, dan Transaction ID; 

### Routing 

/order/new; 
Description : 

1. ketika di request, ini akan membuat data stock untuk pengeluaran barang; 
2. Disini juga terjadi pengecekan expireIn Dari locked stock pada cart, misal jika expire ini akan mengembalikan error, dan order tidak akan dapat di proses; 

/order/list; untuk melihat order yang dilakukan user; 
# event : 
 - Check order sudah masuk ke transaction sesuai dengan order.canceledIn (24 Jam);
 - ketika udah expired, Transaction cancel by sistem;
 - Kemudian dibuatkan stock pembalik;

/order/cancel 
1. Membuat stock in berdasarkan Order data; 
2. Mengubah status dari order; 

/transaction/new; 
1. Ngambil order id; 
2. Ngambil alamat; Nga ada alamat dia akan ngambil alamat yang active;  
3. buat transaction; 
4. Perbarui canceledIn untuk transaction (12 jam); 
5. buat transaction kalkulasi biaya; 
# event : 
 - Check order sudah masuk ke transaction sesuai dengan transaction.lockedIn (12 Jam);
 - ketika udah expired, Transaction cancel by sistem;
 - Kemudian dibuatkan stock pembalik;

/transaction/pay; 
4. Payment Gateaway;



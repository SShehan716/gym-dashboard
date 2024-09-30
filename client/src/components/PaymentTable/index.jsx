import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

//mui imports
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Button, Snackbar, Menu, MenuItem, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, useMediaQuery } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';

//firebase imports
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from "firebase/firestore";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PaymentsTable = () => {

    const [members, setMembers] = useState([]);
    const [payments, setPayments] = useState({});
    const [changes, setChanges] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElYear, setAnchorElYear] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({});

    const currentUser = useSelector(state => state.data.user.user);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const formatPaidForMonth = (year, month) => {
        return new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    useEffect(() => {
        const fetchMembersAndPayments = async () => {
            const membersSnapshot = await getDocs(collection(db, "members"));
            const membersList = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const paymentsQuery = query(
                collection(db, "payments"),
                where("paidForMonth", "==", formatPaidForMonth(selectedYear, selectedMonth))
            );
            const paymentsSnapshot = await getDocs(paymentsQuery);
            const paymentsList = paymentsSnapshot.docs.reduce((acc, doc) => {
                const data = doc.data();
                acc[data.memberId] = { ...data, docId: doc.id };
                return acc;
            }, {});

            setMembers(membersList);
            setPayments(paymentsList);
        };

        fetchMembersAndPayments();
    }, [selectedMonth, selectedYear]);

    const handlePartialPaymentChange = (memberId) => {
        setPayments(prevPayments => ({
            ...prevPayments,
            [memberId]: {
                ...prevPayments[memberId],
                partialPayment: !prevPayments[memberId]?.partialPayment,
            }
        }));
        setChanges(prevChanges => ({
            ...prevChanges,
            [memberId]: true,
        }));
    };

    const handleAmountChange = (memberId, amount) => {
        const isFullyPaid = amount >= 1600;
        setPayments(prevPayments => ({
            ...prevPayments,
            [memberId]: {
                ...prevPayments[memberId],
                paidAmount: amount,
                partialPayment: !isFullyPaid,
            }
        }));
        setChanges(prevChanges => ({
            ...prevChanges,
            [memberId]: true,
        }));
    };

    const handleSave = async (memberId) => {
        const paymentData = payments[memberId];
        if (!paymentData) {
            console.error(`No payment data found for member ID: ${memberId}`);
            return;
        }

        const paymentDetails = {
            memberId: memberId,
            paidDate: new Date().toISOString(),
            paidForMonth: formatPaidForMonth(selectedYear, selectedMonth),
            paidAcceptedPerson: currentUser.email,
            paidAmount: paymentData.paidAmount,
            partialPayment: paymentData.partialPayment || false,
        };

        if (paymentData.docId) {
            // Update existing document
            const paymentDocRef = doc(db, "payments", paymentData.docId);
            await updateDoc(paymentDocRef, paymentDetails);
        } else {
            // Add new document
            await addDoc(collection(db, "payments"), paymentDetails);
        }

        setChanges(prevChanges => ({
            ...prevChanges,
            [memberId]: false,
        }));
        showSuccessSnackbar();
    };

    const handleViewDetails = (member) => {
        setSelectedMember(member);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMember(null);
    };

    const handlePayClick = (member) => {
        setSelectedMember(member);
        setPaymentDetails({
            memberId: member.id,
            name: member.name,
            membershipNumber: member.membershipNumber,
            paidAmount: payments[member.id]?.paidAmount || '',
            partialPayment: payments[member.id]?.partialPayment || false,
            paidForMonth: formatPaidForMonth(selectedYear, selectedMonth),
        });
        setOpenPaymentDialog(true);
    };

    const handlePaymentDialogClose = () => {
        setOpenPaymentDialog(false);
        setSelectedMember(null);
    };

    const handlePaymentDetailsChange = (field, value) => {
        setPaymentDetails(prevDetails => {
            const updatedDetails = {
                ...prevDetails,
                [field]: value,
            };
    
            if (field === 'paidAmount' && value >= 1600) {
                updatedDetails.partialPayment = false;
            }else if(field === 'paidAmount' && value < 1600){
                updatedDetails.partialPayment = value < 1600;
            }
    
            return updatedDetails;
        });
    };

    const handlePaymentSave = async () => {
        const { memberId, paidAmount, partialPayment } = paymentDetails;

        const paymentData = {
            memberId: memberId,
            paidDate: new Date().toISOString(),
            paidForMonth: formatPaidForMonth(selectedYear, selectedMonth),
            paidAcceptedPerson: currentUser.email,
            paidAmount: paidAmount,
            partialPayment: partialPayment,
        };

        if (payments[memberId]?.docId) {
            // Update existing document
            const paymentDocRef = doc(db, "payments", payments[memberId].docId);
            await updateDoc(paymentDocRef, paymentData);
        } else {
            // Add new document
            await addDoc(collection(db, "payments"), paymentData);
        }

        setPayments(prevPayments => ({
            ...prevPayments,
            [memberId]: paymentData,
        }));
        setChanges(prevChanges => ({
            ...prevChanges,
            [memberId]: false,
        }));
        setOpenPaymentDialog(false);
        showSuccessSnackbar();
    };

    // open alert box
    const showSuccessSnackbar = () => {
        setOpenSnackbar(true);
    };

    //close alert box
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleMonthClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleYearClick = (event) => {
        setAnchorElYear(event.currentTarget);
    };

    const handleMonthClose = (month) => {
        setAnchorEl(null);
        if (month !== undefined) {
            setSelectedMonth(month);
        }
    };

    const handleYearClose = (year) => {
        setAnchorElYear(null);
        if (year !== undefined) {
            setSelectedYear(year);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleFilterClick = (event) => {
        setAnchorElFilter(event.currentTarget);
    };

    const handleFilterClose = (filter) => {
        setAnchorElFilter(null);
        if (filter !== undefined) {
            setPaymentFilter(filter);
        }
    };

    const filteredMembers = members.filter(member => {
        const registrationDate = new Date(member.registeredDate);
        const selectedDate = new Date(selectedYear, selectedMonth);
        const isPaid = payments[member.id]?.paidAmount && !payments[member.id]?.partialPayment;
        const isPartialPaid = payments[member.id]?.partialPayment;
        const isNotPaid = !payments[member.id]?.paidAmount;

        let matchesFilter = true;
        if (paymentFilter === 'paid') {
            matchesFilter = isPaid;
        } else if (paymentFilter === 'partialPaid') {
            matchesFilter = isPartialPaid;
        } else if (paymentFilter === 'notPaid') {
            matchesFilter = isNotPaid;
        }

        return (registrationDate.getFullYear() === selectedYear && registrationDate.getMonth() === selectedMonth) &&
            (member.membershipNumber.toString().includes(searchQuery) ||
                member.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
            matchesFilter;
    });

    return (
        <Box sx={{ mt: isMobile ? 0 : 0, p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleMonthClick}
                    endIcon={<ArrowDropDownIcon />}
                    sx={{ fontWeight: 'bold', mr: 2 }}
                >
                    {new Date(0, selectedMonth).toLocaleString('default', { month: 'long' })}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => handleMonthClose()}
                >
                    {Array.from({ length: 12 }, (_, index) => (
                        <MenuItem key={index} onClick={() => handleMonthClose(index)}>
                            {new Date(0, index).toLocaleString('default', { month: 'long' })}
                        </MenuItem>
                    ))}
                </Menu>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleYearClick}
                    endIcon={<ArrowDropDownIcon />}
                    sx={{ fontWeight: 'bold' }}
                >
                    {selectedYear}
                </Button>
                <Menu
                    anchorEl={anchorElYear}
                    open={Boolean(anchorElYear)}
                    onClose={() => handleYearClose()}
                >
                    {Array.from({ length: 10 }, (_, index) => (
                        <MenuItem key={index} onClick={() => handleYearClose(new Date().getFullYear() - index)}>
                            {new Date().getFullYear() - index}
                        </MenuItem>
                    ))}
                </Menu>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleFilterClick}
                    endIcon={<ArrowDropDownIcon />}
                    sx={{ ml: 2 }}
                >
                    {paymentFilter.charAt(0).toUpperCase() + paymentFilter.slice(1)}
                </Button>
                <Menu
                    anchorEl={anchorElFilter}
                    open={Boolean(anchorElFilter)}
                    onClose={() => handleFilterClose()}
                >
                    <MenuItem onClick={() => handleFilterClose('all')}>All</MenuItem>
                    <MenuItem onClick={() => handleFilterClose('paid')}>Paid</MenuItem>
                    <MenuItem onClick={() => handleFilterClose('partialPaid')}>Partial Paid</MenuItem>
                    <MenuItem onClick={() => handleFilterClose('notPaid')}>Not Paid</MenuItem>
                </Menu>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search Member by M.Number or Name"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        style: {
                            height: '40px',
                            borderColor: 'secondary',
                            borderWidth: '2px',
                            borderRadius: '4px'
                        }
                    }}
                    sx={{
                        ml: 0,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'secondary',
                            },
                            '&:hover fieldset': {
                                borderColor: 'secondary',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#4CCEAC',
                            },
                        },
                    }}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>M.Number</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Paid</TableCell>
                            {!isMobile && <TableCell>Partial Payment</TableCell>}
                            {!isMobile && <TableCell>Amount Paid (Rs)</TableCell>}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{member.membershipNumber}</TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>
                                    {payments[member.id]?.paidAmount && !payments[member.id]?.partialPayment ? <CheckIcon color="success" /> : null}
                                    {payments[member.id]?.partialPayment ? <WorkHistoryOutlinedIcon color="warning" /> : null}
                                </TableCell>
                                {!isMobile && (
                                    <TableCell>
                                        <Checkbox
                                            checked={payments[member.id]?.partialPayment || false}
                                            onChange={() => handlePartialPaymentChange(member.id)}
                                        />
                                    </TableCell>
                                )}
                                {!isMobile && (
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={payments[member.id]?.paidAmount || ''}
                                            onChange={(e) => handleAmountChange(member.id, e.target.value)}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>
                                    {!isMobile ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSave(member.id)}
                                            disabled={!changes[member.id] || !payments[member.id]?.paidAmount}
                                            sx={{ ml: isMobile ? 0 : 2, mt: 0 }}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handlePayClick(member)}
                                            disabled={payments[member.id]?.paidAmount && !payments[member.id]?.partialPayment}
                                            sx={{ ml: isMobile ? 0 : 2, mt: 0 }}
                                        >
                                            Pay
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleViewDetails(member)}
                                        sx={{ ml: isMobile ? 0 : 2, mt: isMobile ? 1 : 0 }}
                                    >
                                        <VisibilityIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for member details */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>
                    Member Details
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.error.main,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedMember ? (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Name"
                                value={selectedMember.name}
                                disabled
                                fullWidth
                            />
                            <TextField
                                label="Membership Number"
                                value={selectedMember.membershipNumber}
                                disabled
                                fullWidth
                            />
                            <TextField
                                label="Mobile Number"
                                value={selectedMember.mobile}
                                disabled
                                fullWidth
                            />
                            {payments[selectedMember.id] ? (
                                <>
                                    <TextField
                                        label="Paid For"
                                        value={payments[selectedMember.id].paidForMonth}
                                        disabled
                                        fullWidth
                                    />
                                    <TextField
                                        label="Amount Paid"
                                        value={payments[selectedMember.id].paidAmount}
                                        disabled
                                        fullWidth
                                    />
                                    <TextField
                                        label="Paid Date"
                                        value={new Date(payments[selectedMember.id].paidDate).toLocaleString()}
                                        disabled
                                        fullWidth
                                    />
                                    <TextField
                                        label="Paid To"
                                        value={payments[selectedMember.id].paidAcceptedPerson}
                                        disabled
                                        fullWidth
                                    />
                                    <TextField
                                        label="Payment Status"
                                        value={
                                            payments[selectedMember.id].paidAmount && !payments[selectedMember.id].partialPayment
                                                ? 'Fully Paid'
                                                : payments[selectedMember.id].partialPayment
                                                    ? 'Partially Paid'
                                                    : 'Not Paid'
                                        }
                                        disabled
                                        fullWidth
                                        InputProps={{
                                            style: {
                                                WebkitTextFillColor: payments[selectedMember.id].paidAmount && !payments[selectedMember.id].partialPayment
                                                    ? 'green'
                                                    : payments[selectedMember.id].partialPayment
                                                        ? 'yellow'
                                                        : 'red'
                                            }
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                                WebkitTextFillColor: payments[selectedMember.id].paidAmount && !payments[selectedMember.id].partialPayment
                                                    ? 'green'
                                                    : payments[selectedMember.id].partialPayment
                                                        ? 'yellow'
                                                        : 'red'
                                            }
                                        }}
                                    />
                                </>
                            ) : (
                                <Typography color="error">This member hasn't paid for this month.</Typography>
                            )}
                        </Box>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    {isMobile && (
                        <Button
                            onClick={() => {
                                setOpenDialog(false);
                                handlePayClick(selectedMember);
                            }}
                            color="primary"
                            variant="contained"
                        >
                            Edit
                        </Button>
                    )}
                    <Button onClick={handleCloseDialog} color="info">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for payment details */}
            <Dialog open={openPaymentDialog} onClose={handlePaymentDialogClose} fullWidth>
                <DialogTitle>
                    Payment Details
                    <IconButton
                        aria-label="close"
                        onClick={handlePaymentDialogClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.error.main,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedMember ? (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Name"
                                value={paymentDetails.name}
                                disabled
                                fullWidth
                            />
                            <TextField
                                label="Membership Number"
                                value={paymentDetails.membershipNumber}
                                disabled
                                fullWidth
                            />
                            <TextField
                                label="Paid For"
                                value={paymentDetails.paidForMonth}
                                disabled
                                fullWidth
                            />
                            <TextField
                                label="Amount Paid"
                                type="number"
                                value={paymentDetails.paidAmount}
                                onChange={(e) => handlePaymentDetailsChange('paidAmount', e.target.value)}
                                fullWidth
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox
                                    checked={paymentDetails.partialPayment}
                                    onChange={(e) => handlePaymentDetailsChange('partialPayment', e.target.checked)}
                                />
                                <Typography>Partial Payment</Typography>
                            </Box>
                        </Box>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePaymentSave} color="primary" variant="contained">
                        Save
                    </Button>
                    <Button onClick={handlePaymentDialogClose} color="info">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for successfully updated payment notifications */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Payment updated successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PaymentsTable;
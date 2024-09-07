import React, { useState, useEffect } from 'react';

//mui imports
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, TablePagination, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

//firebase imports
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

// CSS for responsive table
const styles = {
    hideOnMobile: {
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
    nameField: {
        width: '20%',
        '@media (max-width: 600px)': {
            width: '28%',
        },
    },
};

const MemberTable = () => {

    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            const querySnapshot = await getDocs(collection(db, "members"));
            const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMembers(membersList);
        };

        fetchMembers();
    }, []);

    const handleViewClick = (member) => {
        setSelectedMember(member);
        setIsDialogOpen(true);
        setIsEditMode(false);
    };

    const handleEditClick = (member) => {
        setSelectedMember(member);
        setIsDialogOpen(true);
        setIsEditMode(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedMember(null);
    };

    const handleSave = async () => {
        if (selectedMember) {
            const memberRef = doc(db, "members", selectedMember.id);
            await updateDoc(memberRef, selectedMember);
            setIsDialogOpen(false);
            setSelectedMember(null);
            // Refresh the members list
            const querySnapshot = await getDocs(collection(db, "members"));
            const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMembers(membersList);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedMember({ ...selectedMember, [name]: value });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedMembers = filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            {/* Search input */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt:2 }}>
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

            {/* Table to display members */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '10%' }}>M.Number</TableCell>
                            <TableCell sx={styles.nameField}>Name</TableCell>
                            <TableCell sx={styles.hideOnMobile}>Mobile Number</TableCell>
                            <TableCell sx={styles.hideOnMobile}>Date of Birth</TableCell>
                            <TableCell sx={styles.hideOnMobile}>Weight (kg)</TableCell>
                            <TableCell sx={styles.hideOnMobile}>Height (cm)</TableCell>
                            <TableCell sx={styles.hideOnMobile}>Registered Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell sx={{ width: '10%' }}>{member.membershipNumber}</TableCell>
                                <TableCell sx={styles.nameField}>{member.name}</TableCell>
                                <TableCell sx={styles.hideOnMobile}>{member.mobile}</TableCell>
                                <TableCell sx={styles.hideOnMobile}>{member.dob}</TableCell>
                                <TableCell sx={styles.hideOnMobile}>{member.weight}</TableCell>
                                <TableCell sx={styles.hideOnMobile}>{member.height}</TableCell>
                                <TableCell sx={styles.hideOnMobile}>{member.registeredDate}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleViewClick(member)}
                                        sx={{ ml: 1 }}
                                    >
                                        <VisibilityIcon />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEditClick(member)}
                                        sx={{ ml: 1 }}
                                    >
                                        <EditIcon />
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredMembers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Dialog for viewing and editing member details */}
            <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth>
                <DialogTitle>
                    {isEditMode ? "Edit Member Details" : "Member Details"}
                    <IconButton
                        aria-label="close"
                        onClick={handleDialogClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.error,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedMember && (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Membership Number"
                                name="membershipNumber"
                                value={selectedMember.membershipNumber}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                fullWidth
                            />
                            <TextField
                                label="Name"
                                name="name"
                                value={selectedMember.name}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                fullWidth
                            />
                            <TextField
                                label="Mobile Number"
                                name="mobile"
                                value={selectedMember.mobile}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                fullWidth
                            />
                            <TextField
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={selectedMember.dob}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Weight (kg)"
                                name="weight"
                                value={selectedMember.weight}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                fullWidth
                            />
                            <TextField
                                label="Height (cm)"
                                name="height"
                                value={selectedMember.height}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                fullWidth
                            />
                            <TextField
                                label="Registered Date"
                                name="registeredDate"
                                type="date"
                                value={selectedMember.registeredDate}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    {isEditMode && (
                        <Button onClick={handleSave} color="primary" variant="contained">
                            Save
                        </Button>
                    )}
                    <Button onClick={handleDialogClose} color="info">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MemberTable;
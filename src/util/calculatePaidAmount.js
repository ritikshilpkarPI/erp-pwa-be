const calculatePaidAmount = ({ cheques, cashAmount }) => {
  const chequeAmount = cheques?.reduce((total, cheque) => {
    return total + Number(cheque.amount || 0);
  }, 0);
  const paidAmount = chequeAmount + Number(cashAmount || 0);
  return paidAmount;
};
module.exports = {
    calculatePaidAmount
}

document.addEventListener('DOMContentLoaded', async () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseTableBody = document.getElementById('expense-table-body');
    const totalAmountElement = document.getElementById('total-amount');

    
    async function fetchDataAndDisplay() {
        try {
            const response = await fetch('/data');
            const data = await response.json();

        
            expenseTableBody.innerHTML = '';

            
            let totalAmount = 0;
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.Category}</td>
                    <td>${item.Amount}</td>
                    <td>${item.Info}</td>
                    <td>${new Date(item.Date).toLocaleDateString()}</td>
                    <td><button onclick="deleteItem('${item._id}')">Delete</button></td>
                `;
                expenseTableBody.appendChild(row);
                totalAmount += item.Amount;
            });

            
            totalAmountElement.textContent = totalAmount.toFixed(2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    
    expenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(expenseForm);
        const category = formData.get('category_select');
        const amount = parseFloat(formData.get('amount_input'));
        const info = formData.get('info');
        const date = formData.get('date_input');

        
        try {
            await fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category_select: category,
                    amount_input: amount,
                    info: info,
                    date_input: date
                })
            });

            
            await fetchDataAndDisplay();

            
            expenseForm.reset();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    });

    
    await fetchDataAndDisplay();
});


async function deleteItem(itemId) {
    try {
        await fetch(`/delete/${itemId}`, {
            method: 'DELETE'
        });
        
        await fetchDataAndDisplay();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

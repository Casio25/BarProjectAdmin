"use server"



export const getProductsAction = async (storedJwtToken: string) => {
    try {
        console.log("token in server: ", storedJwtToken);
        const response = await fetch("http://localhost:4000/catalog?skip=0&take=70&price={\"minPrice\":100,\"maxPrice\":200}", {
            cache: "no-store",
            method: "GET",
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Authorization": `Bearer ${storedJwtToken}`
            },
        });

        if (response.status === 401) {
            // Unauthorized access
            console.error("Unauthorized access:", response.statusText);
            // You can handle unauthorized access here, e.g., redirect to login page
            return response.status;
        } else {
            // Extract filename from Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
            const filename = filenameMatch ? filenameMatch[1] : 'products.xlsx';

            // Convert the response to a Blob
            const blob = await response.blob();

            // Create a link element and trigger a click event to download the file
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            // Append the link to the body
            document.body.appendChild(link);

            // Trigger a click event to start the download
            setTimeout(() => {
                link.click();

                // Remove the link from the body after a short delay
                document.body.removeChild(link);
            }, 100);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};
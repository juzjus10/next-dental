
# Next Dental 

To install the Next Dental project, please follow these steps:

1.  Install Node.js and npm on your computer if you haven’t already done so.
2.  Open a terminal window and create a new directory for your project.
 
    ```cd next-dental```
    
3. Install all necessary depencies using this command 

	  ```npm install```

4. Configure the environment variables by creating a `env.local` file 
	
    ```NEXTAUTH_SECRET=dental_db```

# Configuring Prisma for Database Connection

5. Open the MYSQL database connection in XAMPP 

6. Install the Prisma CLI globally on the new computer using `npm install -g prisma`.

7. Run the following command to create the database:

     ```prisma db push```
8.  Start the development server by running the following command:
	
    ```npm run dev```
    
9. Open a web browser and go to `http://localhost:3000` to see your Next.js app in action!







function Client() {
     const last = window.location.pathname.split("/").pop();
     console.log(last);
     function handleRedirect() {
          window.location.href = `/clients`;
     }

     return (
          <div>
               <i
                    className="fas fa-arrow-circle-left fa-2x"
                    onClick={() => {
                         handleRedirect();
                    }}
                    style={{ cursor: "pointer" }}
               ></i>

               <p>Client</p>
          </div>
     );
}

export default Client;

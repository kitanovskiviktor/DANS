import '../Styles/style.css';

function NavigationComponent() {
        return (
         <nav className="container mt-3 nav-container">
            <div className="row align-items-center">
            <div className="col-md-8">
                <h5 className="fw-lighter mb-0">stocks.<span className="text-danger">mk</span></h5>
            </div>
            <div className="col-md-4">
                <ul className="d-flex justify-content-around flex-1 mb-0">
                    <li><a href="/">Дома</a></li>
                    <li><a href="/list">Компании</a></li>
                    <li><a href="/prediction">Предикција</a></li>
                </ul>
            </div>
            </div>
         </nav>      
        )
    }
    
    export default NavigationComponent;
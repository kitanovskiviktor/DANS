import NavigationComponent from "./NavigationComponent";
import '../Styles/style.css';
import image from '../Images/image.jpg';
import FooterComponent from "./FooterComponent";

function HomeComponent() {
  return (
    <>
      <NavigationComponent />

      <div className="container home-container">
        <div className="row align-items-center">
            <div className="col-md-6">
                <h4 style={{color: "#A00000"}}>Следи ја просечната цена за акциите на македонската берза!</h4>
                <p className="mt-3">Добиј јасна перцепција за купување на одредена акција како и за нејзината предвидена цена во иднина</p>
                <button className="btn btn-light text-danger fw-bold mt-3"><a href="/list">Погледни ги компаниите -></a></button>
            </div>
            <div className="col-md-6">
                <img src={image} alt="" className="w-75 rounded"/>
            </div>
        </div>
      </div>

      <FooterComponent/>
    </>
  );
}

export default HomeComponent;

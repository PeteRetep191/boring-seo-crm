import { IPlacement } from "../types";

const PlacementDetailsForm: React.FC<{
  placementId?: string;
  onSubmit?: (data: IPlacement) => void;
}> = ({ placementId, onSubmit }) => {
  return (
    <div>
      <h2>Placement Details</h2>
      <form>
        <label htmlFor="placement-name">Name:</label>
        <input type="text" id="placement-name" name="name" required />
        <label htmlFor="placement-location">Location:</label>
        <input type="text" id="placement-location" name="location" required />
        <label htmlFor="placement-date">Date:</label>
        <input type="date" id="placement-date" name="date" required />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default PlacementDetailsForm;

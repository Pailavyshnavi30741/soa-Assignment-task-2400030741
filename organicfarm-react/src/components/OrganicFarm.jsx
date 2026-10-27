import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

const API_URL = 'http://localhost:8001/organicfarm';

const emptyFarm = {
  farmName: '',
  cropType: '',
  areaAcres: '',
  certified: false
};

export default function OrganicFarm() {
  const [farms, setFarms] = useState([]);
  const [farm, setFarm] = useState(emptyFarm);
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchedFarm, setSearchedFarm] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  // Display all farms
  const loadFarms = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/displayAll`);
      setFarms(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      showMessage(
        'Unable to load farms. Check the backend and database connection.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  // Handle form inputs
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFarm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFarm({ ...emptyFarm });
    setEditingId(null);
  };

  // Validate form
  const validateForm = () => {
    if (
      !farm.farmName.trim() ||
      !farm.cropType.trim() ||
      !farm.areaAcres
    ) {
      showMessage('Please fill in all required fields.', 'error');
      return false;
    }

    if (
      !Number.isFinite(Number(farm.areaAcres)) ||
      Number(farm.areaAcres) <= 0
    ) {
      showMessage('Farm area must be greater than zero.', 'error');
      return false;
    }

    return true;
  };

  // Add or update farm
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const payload = {
      farmName: farm.farmName.trim(),
      cropType: farm.cropType.trim(),
      areaAcres: Number(farm.areaAcres),
      certified: Boolean(farm.certified)
    };

    try {
      if (editingId !== null) {
        await axios.put(`${API_URL}/update/${editingId}`, payload);
        showMessage('Farm updated successfully.');
      } else {
        await axios.post(`${API_URL}/add`, payload);
        showMessage('Farm added successfully.');
      }

      resetForm();
      setActivePage('farms');
      await loadFarms();
    } catch (error) {
      const serverMessage = error.response?.data?.message;

      showMessage(
        serverMessage || 'Unable to save farm. Check the backend.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit farm
  const handleEdit = (item) => {
    setFarm({
      farmName: item.farmName ?? '',
      cropType: item.cropType ?? '',
      areaAcres: item.areaAcres ?? '',
      certified: item.certified === true
    });

    setEditingId(item.id);
    setActivePage('add');
    setMessage('');
  };

  // Delete farm
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farm?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      showMessage('Farm deleted successfully.');

      if (searchedFarm?.id === id) {
        setSearchedFarm(null);
      }

      await loadFarms();
    } catch (error) {
      showMessage('Unable to delete farm.', 'error');
    }
  };

  // Search farm by ID
  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchId.trim() || Number(searchId) <= 0) {
      showMessage('Please enter a valid farm ID.', 'error');
      return;
    }

    setLoading(true);
    setSearchedFarm(null);
    setMessage('');

    try {
      const response = await axios.get(
        `${API_URL}/displayById/${searchId}`
      );

      if (!response.data || !response.data.id) {
        showMessage('Farm not found. Please check the ID.', 'error');
      } else {
        setSearchedFarm(response.data);
      }
    } catch (error) {
      showMessage('Farm not found. Please check the ID.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Navigation
  const navigate = (page) => {
    setActivePage(page);
    setMessage('');

    if (page !== 'add') {
      resetForm();
    }

    if (page === 'farms' || page === 'dashboard') {
      loadFarms();
    }

    if (page !== 'search') {
      setSearchedFarm(null);
    }
  };

  // Dashboard calculations
  const totalArea = farms.reduce(
    (total, item) => total + (Number(item.areaAcres) || 0),
    0
  );

  const certifiedFarms = farms.filter(
    (item) => item.certified === true
  ).length;

  const cropVarieties = new Set(
    farms.map((item) => item.cropType).filter(Boolean)
  ).size;

  return (
    <div className="app-container">
      {/* Navigation */}
      <header className="navbar">
        <div className="navbar-container">
          <button
            className="navbar-brand"
            onClick={() => navigate('dashboard')}
          >
            GreenFields
          </button>

          <nav className="navbar-links">
            <button
              className={
                activePage === 'dashboard'
                  ? 'nav-link active'
                  : 'nav-link'
              }
              onClick={() => navigate('dashboard')}
            >
              Dashboard
            </button>

            <button
              className={
                activePage === 'add' ? 'nav-link active' : 'nav-link'
              }
              onClick={() => navigate('add')}
            >
              {editingId !== null ? 'Edit Farm' : 'Add Farm'}
            </button>

            <button
              className={
                activePage === 'farms' ? 'nav-link active' : 'nav-link'
              }
              onClick={() => navigate('farms')}
            >
              All Farms
            </button>

            <button
              className={
                activePage === 'search' ? 'nav-link active' : 'nav-link'
              }
              onClick={() => navigate('search')}
            >
              Find Farm
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {/* Messages */}
        {message && (
          <div className={`message ${messageType}`} role="status">
            {message}

            <button
              className="message-close"
              onClick={() => setMessage('')}
              aria-label="Close message"
            >
              Close
            </button>
          </div>
        )}

        {/* Dashboard */}
        {activePage === 'dashboard' && (
          <>
            <section className="welcome-banner">
              <div>
                <p className="eyebrow">FARM MANAGEMENT</p>
                <h1>Organic Farm Management</h1>
                <p>
                  Manage your farms, crops, land area and certification.
                </p>

                <button
                  className="btn btn-light"
                  onClick={() => navigate('add')}
                >
                  Add Farm
                </button>
              </div>
            </section>

            <section className="stats-grid">
              <article className="stat-card">
                <p>Total Farms</p>
                <h2>{farms.length}</h2>
              </article>

              <article className="stat-card">
                <p>Certified Farms</p>
                <h2>{certifiedFarms}</h2>
              </article>

              <article className="stat-card">
                <p>Total Area</p>
                <h2>{totalArea.toLocaleString()} acres</h2>
              </article>

              <article className="stat-card">
                <p>Crop Varieties</p>
                <h2>{cropVarieties}</h2>
              </article>
            </section>

            <section className="section-card">
              <div className="section-heading">
                <div>
                  <h2>Recent Farms</h2>
                  <p>View and manage your registered farms.</p>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate('farms')}
                >
                  View All
                </button>
              </div>

              {loading ? (
                <p className="state-message">Loading farms...</p>
              ) : farms.length === 0 ? (
                <p className="state-message">
                  No farms registered yet.
                </p>
              ) : (
                renderFarmTable(
                  farms.slice(0, 5),
                  handleEdit,
                  handleDelete
                )
              )}
            </section>
          </>
        )}

        {/* Add and Update Farm */}
        {activePage === 'add' && (
          <section className="section-card form-card">
            <div className="section-heading">
              <div>
                <h1>
                  {editingId !== null ? 'Update Farm' : 'Add New Farm'}
                </h1>
                <p>Enter the farm details below.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="farm-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="farmName">Farm Name</label>
                  <input
                    id="farmName"
                    name="farmName"
                    value={farm.farmName}
                    onChange={handleChange}
                    placeholder="Enter farm name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cropType">Crop Type</label>
                  <input
                    id="cropType"
                    name="cropType"
                    value={farm.cropType}
                    onChange={handleChange}
                    placeholder="Enter crop type"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="areaAcres">Area (acres)</label>
                  <input
                    id="areaAcres"
                    name="areaAcres"
                    type="number"
                    min="0.01"
                    step="any"
                    value={farm.areaAcres}
                    onChange={handleChange}
                    placeholder="Enter land area"
                    required
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label htmlFor="certified">
                    <input
                      id="certified"
                      name="certified"
                      type="checkbox"
                      checked={farm.certified}
                      onChange={handleChange}
                    />
                    Organic Certified
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                      ? 'Update Farm'
                      : 'Save Farm'}
                </button>

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMessage('');
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </section>
        )}

        {/* All Farms */}
        {activePage === 'farms' && (
          <section className="section-card">
            <div className="section-heading">
              <div>
                <h1>All Farms</h1>
                <p>Registered farm details.</p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => navigate('add')}
              >
                Add Farm
              </button>
            </div>

            {loading ? (
              <p className="state-message">Loading farms...</p>
            ) : farms.length === 0 ? (
              <p className="state-message">
                No farms registered yet.
              </p>
            ) : (
              renderFarmTable(farms, handleEdit, handleDelete)
            )}
          </section>
        )}

        {/* Search Farm */}
        {activePage === 'search' && (
          <section className="section-card">
            <div className="section-heading">
              <div>
                <h1>Find Farm</h1>
                <p>Search using the farm ID.</p>
              </div>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                className="search-input"
                type="number"
                min="1"
                value={searchId}
                onChange={(event) => setSearchId(event.target.value)}
                placeholder="Enter farm ID"
                required
              />

              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {searchedFarm && (
              <div className="search-result">
                <h2>{searchedFarm.farmName}</h2>

                <div className="details-grid">
                  <Detail label="Farm ID" value={searchedFarm.id} />

                  <Detail
                    label="Area (acres)"
                    value={searchedFarm.areaAcres}
                  />

                  <Detail
                    label="Crop Type"
                    value={searchedFarm.cropType}
                  />

                  <Detail
                    label="Organic Certified"
                    value={searchedFarm.certified ? 'Yes' : 'No'}
                  />
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        GreenFields Organic Farm Management
      </footer>
    </div>
  );
}

// Farm details
function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value ?? 'Not provided'}</strong>
    </div>
  );
}

// Reusable farm table
function renderFarmTable(farms, handleEdit, handleDelete) {
  return (
    <div className="table-container">
      <table className="farm-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Farm Name</th>
            <th>Crop Type</th>
            <th>Area (acres)</th>
            <th>Certified</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {farms.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.farmName}</td>
              <td>{item.cropType}</td>
              <td>{item.areaAcres}</td>
              <td>{item.certified ? 'Yes' : 'No'}</td>

              <td>
                <div className="table-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
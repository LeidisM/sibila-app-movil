'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Alert, Spinner } from 'react-bootstrap';
import api from '../../app/components/Api';
import styles from '../styles/genericDetail.css';

const GenericDetail = ({
  title,
  endpoint,
  backRoute,
  fields,
  params,
  badgeField,
  icon = 'fa-circle-info'
}) => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`${endpoint}/${id}`);
        setData(response.data);
      } catch (error) {
        console.error(`Error al obtener los datos:`, error);
        setError("No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, endpoint]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert variant="danger" className={styles.alert}>
          <i className={`fas fa-exclamation-triangle ${styles.icon}`}></i>
          {error}
        </Alert>
        <Button 
          variant="secondary" 
          onClick={() => router.push(backRoute)} 
          className={styles.button}
        >
          Volver
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.errorContainer}>
        <Alert variant="warning" className={styles.alert}>
          <i className={`fas fa-question-circle ${styles.icon}`}></i>
          Registro no encontrado
        </Alert>
        <Button 
          variant="secondary" 
          onClick={() => router.push(backRoute)} 
          className={styles.button}
        >
          Volver
        </Button>
      </div>
    );
  }

  const renderFieldValue = (value, fieldConfig) => {
    if (fieldConfig.render) {
      return fieldConfig.render(value, data);
    }
    
    if (fieldConfig.type === 'email') {
      return (
        <a href={`mailto:${value}`} className={styles.emailLink}>
          {value}
        </a>
      );
    }
    
    if (fieldConfig.type === 'date') {
      try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleDateString();
      } catch {
        return value;
      }
    }
    
    if (fieldConfig.type === 'badge') {
      return (
        <span className={styles.badge}>
          {value}
        </span>
      );
    }
    
    return value || 'N/A';
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className={`fas ${icon} ${styles.icon}`}></i> {title}</h2>
        <Button 
          variant="outline-secondary" 
          onClick={() => router.push(backRoute)}
          //className={styles.backButton}
        >
          <i className={`fas fa-arrow-left ${styles.icon}`}></i> 
          <span className={styles.backText}>Volver</span>
        </Button>
      </div>

      <Card className={styles.card}>
        <Card.Header className={styles.cardHeader}>
          <h5 className={styles.cardTitle}>Detalles</h5>
        </Card.Header>
        <Card.Body className={styles.cardBody}>
          {fields.map((field) => (
            <div key={field.key} className={styles.field}>
              <h6 className={styles.fieldLabel}>{field.label}:</h6>
              <p className={styles.fieldValue}>{renderFieldValue(data[field.key], field)}</p>
            </div>
          ))}
          
          {badgeField && data[badgeField.key] && (
            <div className={styles.field}>
              <h6 className={styles.fieldLabel}>{badgeField.label}:</h6>
              <p className={styles.fieldValue}>
                <span className={styles.badge}>
                  {badgeField.render ? badgeField.render(data[badgeField.key], data) : data[badgeField.key]}
                </span>
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default GenericDetail;
import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div style={styles.scrollArea}>
      <div style={styles.categoryContainer}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            style={{
              ...styles.categoryButton,
              ...(selectedCategory === category.id
                ? styles.selectedCategoryButton
                : {}),
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  scrollArea: {
    width: "100%",
    overflowX: "auto",
    whiteSpace: "nowrap",
    padding: "8px 0",
  },
  categoryContainer: {
    display: "flex",
    gap: "8px",
    padding: "0 16px",
  },
  categoryButton: {
    padding: "8px 16px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "9999px", // Fully rounded button
    backgroundColor: "#f3f4f6",
    color: "#374151",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
  },
  selectedCategoryButton: {
    backgroundColor: "#1d4ed8", // Blue background for selected category
    color: "#ffffff",
    borderColor: "#1d4ed8",
  },
};

export default CategoryFilter;

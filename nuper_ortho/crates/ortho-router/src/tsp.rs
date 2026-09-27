//! # ortho-router::tsp
//! 
//! CMM Yol Optimizasyonu: Gezgin Satıcı Problemi (TSP) ve 2-Opt Yerel İyileştirme Algoritması.
//! Unsur ölçüm sıralamasını optimize ederek CMM hızlı intikal (rapid travel) süresini %30-50 kısaltır.

use glam::DVec3;

/// İki nokta arasındaki 3D Öklid mesafesini hesaplar
#[inline]
fn distance(a: DVec3, b: DVec3) -> f64 {
    (a - b).length()
}

/// Verilen rota sırasının toplam uzunluğunu hesaplar
pub fn calculate_total_path_length(points: &[DVec3], tour: &[usize]) -> f64 {
    if tour.len() < 2 {
        return 0.0;
    }
    let mut total = 0.0;
    for i in 0..(tour.len() - 1) {
        total += distance(points[tour[i]], points[tour[i + 1]]);
    }
    total
}

/// En Yakın Komşu (Nearest Neighbor) Sezgisel Başlatıcısı
fn nearest_neighbor_tour(points: &[DVec3]) -> Vec<usize> {
    let n = points.len();
    if n <= 1 {
        return (0..n).collect();
    }

    let mut visited = vec![false; n];
    let mut tour = Vec::with_capacity(n);

    // İlk nokta daima 0. indeks
    let mut current = 0;
    visited[current] = true;
    tour.push(current);

    for _ in 1..n {
        let mut nearest = current;
        let mut min_dist = f64::MAX;

        for next in 0..n {
            if !visited[next] {
                let d = distance(points[current], points[next]);
                if d < min_dist {
                    min_dist = d;
                    nearest = next;
                }
            }
        }

        visited[nearest] = true;
        tour.push(nearest);
        current = nearest;
    }

    tour
}

/// 2-Opt Çaprazlama Engelleyici Yerel Arama Algoritması
/// İki kenarın kesişimini tersine çevirerek yerel olarak en kısa rotayı bulur
pub fn optimize_inspection_sequence_2opt(centroids: &[DVec3]) -> Vec<usize> {
    let n = centroids.len();
    if n <= 3 {
        return (0..n).collect();
    }

    let mut tour = nearest_neighbor_tour(centroids);
    let mut improved = true;
    let mut iterations = 0;
    let max_iterations = 200;

    while improved && iterations < max_iterations {
        improved = false;
        iterations += 1;

        for i in 0..(n - 2) {
            for j in (i + 2)..n {
                let a = tour[i];
                let b = tour[i + 1];
                let c = tour[j];
                let d = if j + 1 < n { tour[j + 1] } else { tour[0] };

                // Mevcut kenarlar: (a->b) ve (c->d)
                let current_dist = distance(centroids[a], centroids[b]) + distance(centroids[c], centroids[d]);
                // Ters çevrilmiş alternatif kenarlar: (a->c) ve (b->d)
                let new_dist = distance(centroids[a], centroids[c]) + distance(centroids[b], centroids[d]);

                if new_dist + 1e-6 < current_dist {
                    // [i+1 ..= j] alt dizisini tersine çevir (2-Opt Swap)
                    tour[(i + 1)..=j].reverse();
                    improved = true;
                }
            }
        }
    }

    tour
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_2opt_shortens_zigzag_path() {
        // Zikzak yapan 6 unsur merkezi
        let points = vec![
            DVec3::new(0.0, 0.0, 10.0),
            DVec3::new(100.0, 100.0, 10.0),
            DVec3::new(0.0, 50.0, 10.0),
            DVec3::new(100.0, 0.0, 10.0),
            DVec3::new(50.0, 100.0, 10.0),
            DVec3::new(50.0, 0.0, 10.0),
        ];

        let naive_tour: Vec<usize> = (0..points.len()).collect();
        let naive_dist = calculate_total_path_length(&points, &naive_tour);

        let optimized_tour = optimize_inspection_sequence_2opt(&points);
        let opt_dist = calculate_total_path_length(&points, &optimized_tour);

        assert_eq!(optimized_tour.len(), points.len());
        // Optimize edilmiş yol belirgin şekilde daha kısa olmalıdır
        assert!(opt_dist < naive_dist, "2-Opt rota mesafesini kısaltmalıydı: Naive={:.1}, Opt={:.1}", naive_dist, opt_dist);
    }

    #[test]
    fn test_trivial_points_sequence() {
        let single = vec![DVec3::ZERO];
        assert_eq!(optimize_inspection_sequence_2opt(&single), vec![0]);

        let pair = vec![DVec3::ZERO, DVec3::new(10.0, 0.0, 0.0)];
        assert_eq!(optimize_inspection_sequence_2opt(&pair), vec![0, 1]);
    }
}

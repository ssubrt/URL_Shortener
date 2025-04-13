import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import  { QRCodeCanvas } from 'qrcode.react';
import { Download, Link2, LogOut, Plus, Search } from 'lucide-react';
import { fetchLinks, createLink } from '../store/slices/linkSlice';
import { logout } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';
import type { Link } from '../types';


interface CreateLinkForm {
  originalUrl: string;
  alias?: string;
  expiresAt?: string;
}

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { links, isLoading, totalPages, currentPage } = useSelector((state: RootState) => state.links);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { register, handleSubmit, reset } = useForm<CreateLinkForm>();

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      dispatch(fetchLinks({ page: 1, search: searchTerm }));
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [dispatch, searchTerm]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCreateLink = async (data: CreateLinkForm) => {
    try {
      await dispatch(createLink(data)).unwrap();
      setShowCreateModal(false);
      reset();
      dispatch(fetchLinks({ page: 1, search: searchTerm }));
    } catch (error) {
      console.error('Failed to create link:', error);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchLinks({ page, search: searchTerm }));
  };

  const handleLinkClick = async (shortUrl: string) => {
    window.open(`${import.meta.env.VITE_API_URL}/links/${shortUrl}`, '_blank');
    // Refresh the links after a short delay to show updated click count
    setTimeout(() => {
      dispatch(fetchLinks({ page: currentPage, search: searchTerm }));
    }, 1000);
  };

     // Function to handle QR code download
     const downloadQRCode = (shortUrl: string) => {
      const canvas = document.getElementById(`qr-${shortUrl}`) as HTMLCanvasElement;
      if (canvas) {
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qr-${shortUrl.replace(/^https?:\/\//, '')}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">URL Shortener</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Link
            </button>
          </div>


          <div className="bg-white shadow rounded-lg">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden border-b border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Original URL
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Short URL
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            QR Code
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clicks
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expires
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                              Loading...
                            </td>
                          </tr>
                        ) : links.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                              No links found
                            </td>
                          </tr>
                        ) : (
                          links.map((link: Link) => (
                            <tr key={link.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {link.originalUrl}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                                <a href={link.originalUrl}  onClick={() => handleLinkClick(link.shortUrl)} target="_blank" rel="noopener noreferrer">
                                  https://{link.shortUrl}.com
                                </a>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    <QRCodeCanvas
                                      id={`qr-${link.shortUrl}`}
                                      value={link.shortUrl}
                                      size={48}
                                      level="H"
                                      includeMargin={true}
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      downloadQRCode(link.shortUrl)
                                    }
                                    className="text-gray-500 hover:text-indigo-600"
                                    title="Download QR Code"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {link.clicks}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(link.createdAt), 'MMM d, yyyy')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {link.expiresAt ? format(new Date(link.expiresAt), 'MMM d, yyyy') : '-'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit(handleCreateLink)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700">
                      Original URL
                    </label>
                    <input
                      type="url"
                      {...register('originalUrl', { required: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="alias" className="block text-sm font-medium text-gray-700">
                      Custom Alias (optional)
                    </label>
                    <input
                      type="text"
                      {...register('alias')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
                      Expiration Date (optional)
                    </label>
                    <input
                      type="date"
                      {...register('expiresAt')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;